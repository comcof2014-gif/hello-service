"use client";

import { useEffect, useState } from "react";

interface Trip {
  id: string;
  title: string;
  user_id: string;
  is_public: boolean;
  created_at: string;
  profiles: { email: string } | null;
}

export default function TripsTab() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/trips")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setTrips(res.data);
        else setError(res.error);
      })
      .catch(() => setError("불러오기 실패"))
      .finally(() => setLoading(false));
  }, []);

  async function togglePublic(id: string, current: boolean) {
    const res = await fetch(`/api/admin/trips/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_public: !current }),
    }).then((r) => r.json());

    if (res.success) {
      setTrips((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_public: !current } : t)),
      );
    }
  }

  async function deleteTrip(id: string) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/admin/trips/${id}`, {
      method: "DELETE",
    }).then((r) => r.json());

    if (res.success) {
      setTrips((prev) => prev.filter((t) => t.id !== id));
    }
  }

  if (loading) return <p className="text-sm text-gray-500">불러오는 중...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="pb-3 pr-6 font-medium">제목</th>
            <th className="pb-3 pr-6 font-medium">유저</th>
            <th className="pb-3 pr-6 font-medium">공개 여부</th>
            <th className="pb-3 pr-6 font-medium">생성일</th>
            <th className="pb-3 font-medium">액션</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((t) => (
            <tr key={t.id} className="border-b last:border-0">
              <td className="py-3 pr-6 font-medium">{t.title}</td>
              <td className="py-3 pr-6 text-gray-500">
                {t.profiles?.email ?? t.user_id.slice(0, 8) + "..."}
              </td>
              <td className="py-3 pr-6">
                <button
                  onClick={() => togglePublic(t.id, t.is_public)}
                  className={`rounded-full px-3 py-0.5 text-xs font-medium transition-colors ${
                    t.is_public
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t.is_public ? "공개" : "비공개"}
                </button>
              </td>
              <td className="py-3 pr-6 text-gray-500">
                {new Date(t.created_at).toLocaleDateString("ko-KR")}
              </td>
              <td className="py-3">
                <button
                  onClick={() => deleteTrip(t.id)}
                  className="rounded px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {trips.length === 0 && (
        <p className="mt-6 text-center text-sm text-gray-400">트립이 없습니다.</p>
      )}
    </div>
  );
}
