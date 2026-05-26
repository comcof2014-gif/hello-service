"use client";

import { useEffect, useState } from "react";

interface Profile {
  id: string;
  email: string;
  role: "user" | "admin";
  is_active: boolean;
  created_at: string;
}

export default function UsersTab() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setUsers(res.data);
        else setError(res.error);
      })
      .catch(() => setError("불러오기 실패"))
      .finally(() => setLoading(false));
  }, []);

  async function updateUser(id: string, patch: Partial<Profile>) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    }).then((r) => r.json());

    if (res.success) {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...patch } : u)),
      );
    }
  }

  if (loading) return <p className="text-sm text-gray-500">불러오는 중...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="pb-3 pr-6 font-medium">이메일</th>
            <th className="pb-3 pr-6 font-medium">역할</th>
            <th className="pb-3 pr-6 font-medium">상태</th>
            <th className="pb-3 pr-6 font-medium">가입일</th>
            <th className="pb-3 font-medium">액션</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b last:border-0">
              <td className="py-3 pr-6">{u.email}</td>
              <td className="py-3 pr-6">
                <select
                  value={u.role}
                  onChange={(e) =>
                    updateUser(u.id, { role: e.target.value as Profile["role"] })
                  }
                  className="rounded border px-2 py-1 text-xs"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td className="py-3 pr-6">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    u.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {u.is_active ? "활성" : "비활성"}
                </span>
              </td>
              <td className="py-3 pr-6 text-gray-500">
                {new Date(u.created_at).toLocaleDateString("ko-KR")}
              </td>
              <td className="py-3">
                <button
                  onClick={() => updateUser(u.id, { is_active: !u.is_active })}
                  className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                    u.is_active
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {u.is_active ? "비활성화" : "활성화"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <p className="mt-6 text-center text-sm text-gray-400">유저가 없습니다.</p>
      )}
    </div>
  );
}
