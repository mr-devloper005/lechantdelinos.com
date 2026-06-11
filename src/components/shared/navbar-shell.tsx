"use client";

import { Suspense } from "react";
import { EditableNavbar } from "@/editable/shell/EditableNavbar";

export function NavbarShell() {
  return (
    <Suspense fallback={null}>
      <EditableNavbar />
    </Suspense>
  );
}
