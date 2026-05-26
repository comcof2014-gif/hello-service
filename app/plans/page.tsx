import { getAuthUser } from "@/app/lib/auth";
import { createClient } from "@/app/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

interface Plan {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export default async function PlansPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data: plans } = await supabase
    .from("travel_plans")
    .select("id, title, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">내 여행 계획</h1>
        <Link
          href="/chat"
          className="rounded-full bg-black px-4 py-2 text-sm text-white"
        >
          새 계획
        </Link>
      </div>

      {!plans || plans.length === 0 ? (
        <div className="mt-20 text-center">
          <p className="text-gray-500">저장된 여행 계획이 없습니다.</p>
          <Link href="/chat" className="mt-4 inline-block text-sm underline">
            첫 번째 계획 만들기
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {(plans as Plan[]).map((plan) => (
            <li key={plan.id}>
              <Link
                href={`/chat?planId=${plan.id}`}
                className="flex items-center justify-between rounded-xl border px-5 py-4 hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">{plan.title}</p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {new Date(plan.updated_at).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
