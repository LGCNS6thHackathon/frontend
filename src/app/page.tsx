import { IS_MOCK } from "@/lib/data-mode";
import MockPortal from "@/components/mock/mock-portal";
import StudentPortal from "@/components/live/student-portal";
export default function Page() {
  return IS_MOCK ? <MockPortal /> : <StudentPortal />;
}
