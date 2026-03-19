"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MysticLoader } from "@/components/ui/MysticLoader";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else {
        setChecking(false);
      }
    });
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <MysticLoader text="Verificando sua sessão..." />
      </div>
    );
  }

  return <>{children}</>;
}
