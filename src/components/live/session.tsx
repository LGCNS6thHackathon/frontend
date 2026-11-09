'use client';
import {createContext,useCallback,useContext,useEffect,useState} from 'react';
import {usePathname,useRouter} from 'next/navigation';
import {api,allPages} from '@/lib/api-client';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card,CardContent,CardHeader,CardTitle} from '@/components/ui/card';
export type User={id:number;name:string;email:string;phone?:string;role:string;status:string};
export type Cohort={id:number;name:string;courseId:number;startDate:string;endDate:string;classroomUrl?:string;materialsUrl?:string};
type Session={user:User;cohort:Cohort|null;cohorts:Cohort[];selectCohort:(id:number)=>void;reload:()=>Promise<void>;logout:()=>Promise<void>;notify:(message:string,error?:boolean)=>void};
const Context=createContext<Session|null>(null);
export function useSession(){const value=useContext(Context);if(!value)throw Error('SessionProvider가 필요합니다.');return value;}
export function SessionProvider({children}:{children:React.ReactNode}){
 const [user,setUser]=useState<User|null>(null),[cohorts,setCohorts]=useState<Cohort[]>([]),[cohortId,setCohort]=useState(0),[loading,setLoading]=useState(true),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''),[saving,setSaving]=useState(false),[toasts,setToasts]=useState<{id:number;message:string;error:boolean}[]>([]);
 const pathname=usePathname(),router=useRouter();
 const notify=useCallback((message:string,error=false)=>{const id=Date.now()+Math.random();setToasts(t=>[...t.slice(-3),{id,message,error}]);setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),6500);},[]);
 const reload=useCallback(async()=>{const me=await api<User>('/api/me');const list=await allPages<Cohort>('/api/cohorts');setUser(me);setCohorts(list);setCohort(current=>list.some(x=>x.id===current)?current:list[0]?.id||0);},[]);
 useEffect(()=>{reload().catch(e=>{if(e.status!==401)setError(e.message);}).finally(()=>setLoading(false));const expired=()=>{setUser(null);setCohorts([]);};window.addEventListener('lms:unauthorized',expired);return()=>window.removeEventListener('lms:unauthorized',expired);},[reload]);
 const logout=async()=>{try{await api('/api/auth/logout','POST',{});setUser(null);setCohorts([]);router.push('/');}catch(e){notify((e as Error).message,true);}};
 const toast=<div className="fixed bottom-5 right-5 z-[100] flex w-96 max-w-[calc(100vw-2rem)] flex-col gap-2" aria-live="polite">{toasts.map(t=><div key={t.id} role={t.error?'alert':'status'} className={`rounded-[20px] border bg-card p-4 text-sm shadow-lg ${t.error?'border-destructive/40 text-destructive':'border-border'}`}>{t.message}</div>)}</div>;
 if(pathname.startsWith('/public/'))return <>{children}</>;
 if(loading)return <div className="grid min-h-screen place-items-center text-muted-foreground">세션을 확인하고 있습니다…</div>;
 if(!user)return <div className="grid min-h-screen place-items-center bg-background p-4"><Card className="w-full max-w-sm"><CardHeader><CardTitle>Inspire LMS 로그인</CardTitle><p className="text-sm text-muted-foreground">발급받은 계정으로 로그인하세요.</p></CardHeader><CardContent><form className="space-y-4" onSubmit={async e=>{e.preventDefault();setSaving(true);setError('');try{await api('/api/auth/login','POST',{email,password});setPassword('');await reload();}catch(e){setError((e as Error).message);}finally{setSaving(false);}}}><label className="grid gap-2 text-sm">이메일<Input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label className="grid gap-2 text-sm">비밀번호<Input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<p role="alert" className="text-sm text-destructive">{error}</p>}<Button type="submit" className="w-full" disabled={saving}>{saving?'로그인 중…':'로그인'}</Button></form></CardContent></Card>{toast}</div>;
 if(pathname.startsWith('/admin')&&user.role!=='ADMIN')return <div className="grid min-h-screen place-items-center"><Card><CardContent className="space-y-4 pt-6"><p>관리자 권한이 필요합니다.</p><Button onClick={()=>router.push('/')}>수강생 화면으로</Button></CardContent></Card></div>;
 return <Context.Provider value={{user,cohorts,cohort:cohorts.find(x=>x.id===cohortId)||null,selectCohort:setCohort,reload,logout,notify}}>{children}{toast}</Context.Provider>;
}
export function SessionToolbar(){const {user,cohort,cohorts,selectCohort,logout}=useSession();return <div className="flex flex-wrap items-center justify-end gap-3 border-b bg-card px-6 py-2 text-xs"><span>{user.name} · {user.role}</span><select aria-label="학습 기수" className="rounded-md border bg-background p-1.5" value={cohort?.id||''} onChange={e=>selectCohort(Number(e.target.value))}>{!cohorts.length&&<option>배정된 기수가 없습니다</option>}{cohorts.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select><Button variant="ghost" size="xs" onClick={logout}>로그아웃</Button></div>;}
