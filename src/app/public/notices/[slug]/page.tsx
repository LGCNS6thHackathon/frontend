import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
export default function PublicNotice() {
  return (
    <main className="mx-auto max-w-2xl p-6 py-16">
      <Card>
        <CardHeader>
          <CardTitle>공개 공지 미제공</CardTitle>
        </CardHeader>
        <CardContent>
          현재 백엔드는 공개 공지 링크를 제공하지 않습니다. 로그인한 뒤
          공지사항에서 확인해 주세요.
        </CardContent>
      </Card>
    </main>
  );
}
