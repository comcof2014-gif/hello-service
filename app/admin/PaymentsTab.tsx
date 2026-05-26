"use client";

import { useEffect, useState } from "react";

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: "completed" | "refunded" | "pending";
  description: string | null;
  created_at: string;
  profiles: { email: string } | null;
}

const STATUS_LABEL: Record<Payment["status"], string> = {
  completed: "완료",
  refunded: "환불",
  pending: "대기",
};

const STATUS_COLOR: Record<Payment["status"], string> = {
  completed: "bg-green-100 text-green-700",
  refunded: "bg-red-100 text-red-600",
  pending: "bg-yellow-100 text-yellow-700",
};

export default function PaymentsTab() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  function fetchPayments() {
    setLoading(true);
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to + "T23:59:59");
    fetch(`/api/admin/payments?${params}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setPayments(res.data);
        else setError(res.error);
      })
      .catch(() => setError("불러오기 실패"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchPayments();
  }, []);

  async function updateStatus(id: string, status: Payment["status"]) {
    const res = await fetch(`/api/admin/payments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).then((r) => r.json());

    if (res.success) {
      setPayments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p)),
      );
    }
  }

  const total = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">시작일</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded border px-3 py-1.5 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">종료일</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded border px-3 py-1.5 text-sm"
          />
        </div>
        <button
          onClick={fetchPayments}
          className="rounded bg-black px-4 py-1.5 text-sm text-white hover:bg-gray-800"
        >
          조회
        </button>
        <div className="ml-auto rounded-lg bg-gray-50 px-5 py-2 text-sm">
          <span className="text-gray-500">완료 매출 합계</span>
          <span className="ml-3 text-lg font-semibold">
            {total.toLocaleString("ko-KR")}원
          </span>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">불러오는 중...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-3 pr-6 font-medium">유저</th>
                <th className="pb-3 pr-6 font-medium">금액</th>
                <th className="pb-3 pr-6 font-medium">설명</th>
                <th className="pb-3 pr-6 font-medium">상태</th>
                <th className="pb-3 pr-6 font-medium">일시</th>
                <th className="pb-3 font-medium">액션</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="py-3 pr-6 text-gray-500">
                    {p.profiles?.email ?? p.user_id?.slice(0, 8) + "..."}
                  </td>
                  <td className="py-3 pr-6 font-medium">
                    {p.amount.toLocaleString("ko-KR")}
                    <span className="ml-1 text-xs text-gray-400">{p.currency}</span>
                  </td>
                  <td className="py-3 pr-6 text-gray-500">{p.description ?? "-"}</td>
                  <td className="py-3 pr-6">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[p.status]}`}
                    >
                      {STATUS_LABEL[p.status]}
                    </span>
                  </td>
                  <td className="py-3 pr-6 text-gray-500">
                    {new Date(p.created_at).toLocaleString("ko-KR")}
                  </td>
                  <td className="py-3">
                    <select
                      value={p.status}
                      onChange={(e) =>
                        updateStatus(p.id, e.target.value as Payment["status"])
                      }
                      className="rounded border px-2 py-1 text-xs"
                    >
                      <option value="completed">완료</option>
                      <option value="pending">대기</option>
                      <option value="refunded">환불</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {payments.length === 0 && (
            <p className="mt-6 text-center text-sm text-gray-400">결제 내역이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}
