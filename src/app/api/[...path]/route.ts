import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const backend = (process.env.BACKEND_URL || 'http://127.0.0.1:8080').replace(/\/$/, '');
const refreshing = new Map<string, Promise<Response>>();
function cookies(response: NextResponse, tokens?: {accessToken:string;refreshToken:string;expiresIn:number;refreshExpiresIn:number}) {
  const options = {httpOnly:true, secure:process.env.NODE_ENV==='production' && process.env.COOKIE_SECURE!=='false', sameSite:'lax' as const, path:'/'};
  response.cookies.set('lms_access', tokens?.accessToken || '', {...options,maxAge:tokens?.expiresIn || 0});
  response.cookies.set('lms_refresh', tokens?.refreshToken || '', {...options,maxAge:tokens?.refreshExpiresIn || 0});
  return response;
}
async function proxy(req:NextRequest, context:{params:Promise<{path:string[]}>}) {
  const {path} = await context.params;
  if(!['GET','HEAD'].includes(req.method)) {
    const origin=req.headers.get('origin');
    if(origin && origin!==req.nextUrl.origin) return NextResponse.json({message:'요청 출처를 확인해주세요.'},{status:403});
  }
  const route=path.join('/');
  if(route==='auth/refresh') return NextResponse.json({message:'세션은 서버에서 갱신합니다.'},{status:404});
  try {
    const access=req.cookies.get('lms_access')?.value;
    const refresh=req.cookies.get('lms_refresh')?.value;
    const isLogin=route==='auth/login';
    const isLogout=route==='auth/logout';
    const body=['GET','HEAD'].includes(req.method)?undefined:isLogout?JSON.stringify({refreshToken:refresh||''}):await req.arrayBuffer();
    const send=(token?:string)=>fetch(`${backend}/api/${path.map(encodeURIComponent).join('/')}${req.nextUrl.search}`,{
      method:req.method,cache:'no-store',signal:AbortSignal.timeout(60000),
      headers:{...(token?{Authorization:`Bearer ${token}`}:{ }),...(req.headers.get('content-type')?{'Content-Type':req.headers.get('content-type')!}:{}),...(isLogout?{'Content-Type':'application/json'}:{})},body,
    });
    let result=await send(access);
    let newTokens;
    if(result.status===401 && refresh && !isLogin && !isLogout) {
      let pending=refreshing.get(refresh);
      if(!pending){pending=fetch(`${backend}/api/auth/refresh`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({refreshToken:refresh}),cache:'no-store',signal:AbortSignal.timeout(15000)});refreshing.set(refresh,pending);setTimeout(()=>refreshing.delete(refresh),5000);}
      const renewal=(await pending).clone();
      if(renewal.ok){newTokens=await renewal.json();result=await send(newTokens.accessToken);}
      else return cookies(NextResponse.json({message:'로그인이 만료되었습니다. 다시 로그인해 주세요.'},{status:401}));
    }
    if(isLogin && result.ok){newTokens=await result.json();return cookies(NextResponse.json({user:newTokens.user}),newTokens);}
    if(isLogout){return cookies(new NextResponse(null,{status:204}));}
    const headers=new Headers();
    for(const key of ['content-type','content-disposition','content-length']){const value=result.headers.get(key);if(value)headers.set(key,value);}
    headers.set('Cache-Control','no-store');
    const response=new NextResponse(result.body,{status:result.status,headers});
    if(newTokens)cookies(response,newTokens);
    else if(result.status===401&&!isLogin)cookies(response);
    return response;
  }catch{return NextResponse.json({code:'BACKEND_UNAVAILABLE',message:'백엔드 서버에 연결하지 못했습니다. 서버 실행 상태를 확인해 주세요.'},{status:502});}
}
export {proxy as GET,proxy as POST,proxy as PUT,proxy as PATCH,proxy as DELETE};
