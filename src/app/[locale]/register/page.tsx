"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * RegisterPage - Disabled
 * Public registration is no longer allowed.
 * All access is redirected to the login page.
 */
export default function RegisterPage() {
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login immediately
    router.replace(`/${locale}/login`);
  }, [locale, router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 border-4 border-muted border-t-foreground animate-spin rounded-full mb-4" />
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        Redirecting to Management Access...
      </p>
    </div>
  );
}
