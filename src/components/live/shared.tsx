"use client";
import { useCallback, useEffect, useState } from "react";
import { api, allPages, downloadFile, FileInfo } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "./session";
export function useResource<T>(path: string, list = false) {
  const [data, setData] = useState<T>(),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [version, setVersion] = useState(0);
  const reload = useCallback(() => setVersion((v) => v + 1), []);
  useEffect(() => {
    window.addEventListener("lms:changed", reload);
    return () => window.removeEventListener("lms:changed", reload);
  }, [reload]);
  useEffect(() => {
    let current = true;
    setData(undefined);
    setLoading(true);
    setError("");
    (list ? allPages(path) : api(path))
      .then((result) => {
        if (current) setData(result as T);
      })
      .catch((e) => {
        if (current) setError(e.message);
      })
      .finally(() => {
        if (current) setLoading(false);
      });
    return () => {
      current = false;
    };
  }, [path, list, version]);
  return { data, error, loading, reload };
}
export function State({
  loading,
  error,
  retry,
  empty = false,
}: {
  loading: boolean;
  error: string;
  retry: () => void;
  empty?: boolean;
}) {
  return (
    <Card>
      <CardContent className="space-y-3 p-8 text-center text-sm text-muted-foreground">
        {loading
          ? "데이터를 불러오고 있습니다…"
          : error || (empty ? "아직 등록된 데이터가 없습니다." : "")}
        {error && (
          <div>
            <Button variant="outline" onClick={retry}>
              다시 시도
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export function Files({ files = [] }: { files?: FileInfo[] }) {
  const { notify } = useSession();
  return (
    <div className="flex flex-wrap gap-2">
      {files.map((file) => (
        <Button
          type="button"
          key={file.id}
          variant="outline"
          size="sm"
          onClick={() =>
            downloadFile(file).catch((e) => notify(e.message, true))
          }
        >
          {file.originalName} ↓
        </Button>
      ))}
    </div>
  );
}
export const fieldClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm";
export function useMutation() {
  const [busy, setBusy] = useState(false);
  const { notify } = useSession();
  return {
    busy,
    run: async (task: () => Promise<void>, message?: string) => {
      if (busy) return;
      setBusy(true);
      try {
        await task();
        if (message) notify(message);
      } catch (e) {
        notify((e as Error).message, true);
      } finally {
        setBusy(false);
      }
    },
  };
}
