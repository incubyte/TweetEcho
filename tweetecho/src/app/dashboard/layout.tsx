import ProtectedRoute from "@/components/protected-route";
import { PropsWithChildren } from "react";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
