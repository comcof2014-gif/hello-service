"use client";

import { createClient } from "@/app/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  email?: string;
}

export default function Header({ email }: HeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b px-6 py-4">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <Link href="/" className="text-sm font-semibold">
          AI 여행 플래너
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/chat" className="text-sm text-gray-600 hover:text-black">
            새 계획
          </Link>
          <Link href="/plans" className="text-sm text-gray-600 hover:text-black">
            내 계획
          </Link>
          {email && (
            <>
              <span className="text-xs text-gray-400">{email}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-black"
              >
                로그아웃
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
