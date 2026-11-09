'use client';
import {useParams} from 'next/navigation';
import {useResource,State} from '@/components/live/shared';
import {Card,CardHeader,CardTitle,CardContent} from '@/components/ui/card';
import {koreanTime} from '@/lib/api-client';
export default function PublicNotice(){const {slug}=useParams<{slug:string}>();const result=useResource<{title:string;body:string;createdAt:string}>(`/api/public/notices/${encodeURIComponent(slug)}`);return <main className="mx-auto max-w-2xl p-6 py-16">{result.data?<Card><CardHeader><CardTitle>{result.data.title}</CardTitle><p className="text-xs text-muted-foreground">{koreanTime(result.data.createdAt)}</p></CardHeader><CardContent className="whitespace-pre-wrap text-sm">{result.data.body}</CardContent></Card>:<State {...result} retry={result.reload}/>}</main>;}
