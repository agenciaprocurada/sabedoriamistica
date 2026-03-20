"use client";

import { usePathname } from "next/navigation";

export function AppShell({
  children,
  header,
  footer,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/sabedoriaadm");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      <main className="flex-1 relative z-10">
        <div className="max-w-5xl mx-auto px-6 pt-0 pb-10 md:pt-10">{children}</div>
      </main>
      {footer}
    </>
  );
}
