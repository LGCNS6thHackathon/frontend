"use client";

import * as React from "react";
import {
  CheckCircle2,
  Copy,
  CreditCard,
  ExternalLink,
  Eye,
  EyeOff,
  Save,
  Server,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { INITIAL_USER, UserProfile } from "@/lib/lms-data";

export function MyPageView() {
  const [user, setUser] = React.useState<UserProfile>(INITIAL_USER);
  const [showPassword, setShowPassword] = React.useState(false);
  const tempPassword = "Inspire2026!@#$";

  // Editable profile state
  const [phone, setPhone] = React.useState(user.phone);
  const [bank, setBank] = React.useState(user.allowanceBank);
  const [account, setAccount] = React.useState(user.allowanceAccount);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      phone,
      allowanceBank: bank,
      allowanceAccount: account,
    }));
    alert("개인정보 및 수당 계좌가 성공적으로 업데이트되었습니다!");
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label}이(가) 클립보드에 복사되었습니다: ${text}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Profile Summary Card */}
      <Card className="bg-gradient-to-r from-card to-muted/40 border">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <Avatar size="lg" className="size-16 ring-2 ring-primary/20">
              <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" />
              <AvatarFallback className="text-lg">창일</AvatarFallback>
            </Avatar>

            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold text-foreground">{user.name} 수강생</h2>
                <Badge variant="default" className="text-[10px]">
                  {user.course} {user.generation}
                </Badge>
                <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30">
                  정규 수강 중
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                이메일: <span className="font-mono">{user.email}</span> | 연락처: {user.phone}
              </p>
              <p className="text-xs text-muted-foreground">
                누적 출석률: <b className="text-emerald-600 dark:text-emerald-400">{user.attendanceRate}%</b> (120일 중 {user.attendedDays}일 출석, 지각 {user.lateDays}회)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: AWS Cloud Hub (Moved from Home Bottom) */}
        <div className="space-y-4">
          <Card className="border-indigo-500/30">
            <CardHeader className="pb-3 border-b bg-indigo-500/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Server className="size-4 text-indigo-500" />
                  AWS 실습 클라우드 계정 관리
                </CardTitle>
                <Badge variant="outline" className="text-[10px] bg-background">
                  크레딧 $200 활성
                </Badge>
              </div>
              <CardDescription className="text-xs">
                실습 및 해커톤 인프라 배포를 위한 공식 IAM 자격증명
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              <div className="space-y-3 text-xs">
                {/* Account ID */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    AWS 계정 ID (12자리)
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={user.awsAccountId}
                      className="font-mono text-xs bg-muted/40 h-8"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-2.5"
                      onClick={() => copyToClipboard(user.awsAccountId, "AWS 계정 ID")}
                    >
                      <Copy className="size-3.5" />
                    </Button>
                  </div>
                </div>

                {/* IAM Username */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    IAM 사용자명
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={user.awsIamUser}
                      className="font-mono text-xs bg-muted/40 h-8"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-2.5"
                      onClick={() => copyToClipboard(user.awsIamUser, "IAM 사용자명")}
                    >
                      <Copy className="size-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Password with Mask/Unmask */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    초기 임시 비밀번호
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      type={showPassword ? "text" : "password"}
                      value={tempPassword}
                      className="font-mono text-xs bg-muted/40 h-8"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-2.5"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-2.5"
                      onClick={() => copyToClipboard(tempPassword, "비밀번호")}
                    >
                      <Copy className="size-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Region Info */}
                <div className="p-2.5 rounded-lg bg-muted/30 border text-[11px] flex items-center justify-between">
                  <span className="text-muted-foreground">기본 리전:</span>
                  <span className="font-semibold text-foreground">{user.awsRegion}</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  className="w-full gap-2 text-xs h-9 bg-amber-600 hover:bg-amber-700 text-white font-bold"
                  onClick={() => window.open("https://signin.aws.amazon.com/console", "_blank")}
                >
                  <ExternalLink className="size-3.5" />
                  AWS Management Console 바로가기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Personal Info & Allowance Account Form */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <CreditCard className="size-4 text-primary" />
                훈련수당 지급 계좌 및 개인정보 변경
              </CardTitle>
              <CardDescription className="text-xs">
                매월 단위기간 출석률에 따라 지급되는 훈련장려금 계좌 정보
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4">
              <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">이름</label>
                  <Input readOnly value={user.name} className="bg-muted/30 h-8 text-xs font-semibold" />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">연락처 (휴대폰)</label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-8 text-xs font-mono"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-muted-foreground">은행명</label>
                    <Input
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                      className="h-8 text-xs"
                      required
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="font-semibold text-muted-foreground">계좌번호</label>
                    <Input
                      value={account}
                      onChange={(e) => setAccount(e.target.value)}
                      className="h-8 text-xs font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] space-y-1 text-emerald-800 dark:text-emerald-300">
                  <span className="font-bold flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" /> 11월 수당 지급 예상 현황
                  </span>
                  <p>
                    단위기간(10/24 ~ 11/23) 출석률 100% 달성 시 익월 첫째 주에 해당 계좌로 약 316,000원이 입금됩니다.
                  </p>
                </div>

                <div className="pt-2">
                  <Button type="submit" size="sm" className="w-full gap-1.5 text-xs h-8">
                    <Save className="size-3.5" /> 저장하기
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
