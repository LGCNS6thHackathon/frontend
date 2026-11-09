export class ApiError extends Error {constructor(public status:number,message:string,public code?:string){super(message);}}
export async function api<T>(path:string,method='GET',body?:unknown):Promise<T>{
 const response=await fetch(path,{method,credentials:'same-origin',cache:'no-store',headers:body instanceof FormData?{}:{'Content-Type':'application/json'},body:body===undefined?undefined:body instanceof FormData?body:JSON.stringify(body)});
 if(!response.ok){const error=await response.json().catch(()=>({}));if(response.status===401&&typeof window!=='undefined')window.dispatchEvent(new Event('lms:unauthorized'));throw new ApiError(response.status,error.message||`요청에 실패했습니다. (${response.status})`,error.code);}
 return response.status===204?undefined as T:response.json();
}
export async function allPages<T>(path:string):Promise<T[]>{const rows:T[]=[];for(let page=0;;page++){const result=await api<{items:T[];total:number}|T[]>(`${path}${path.includes('?')?'&':'?'}page=${page}&size=100`);if(Array.isArray(result))return result;rows.push(...result.items);if(!result.items.length||rows.length>=result.total)return rows;}}
export type FileInfo={id:number;originalName:string;sizeBytes:number;downloadUrl?:string};
export async function downloadFile(file:FileInfo){const response=await fetch(`/api/files/${file.id}/download`,{credentials:'same-origin'});if(!response.ok)throw new ApiError(response.status,'파일을 다운로드하지 못했습니다.');const url=URL.createObjectURL(await response.blob());const a=document.createElement('a');a.href=url;a.download=file.originalName;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export const koreanTime=(value?:string|null)=>value?new Date(value).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'}):'—';
