"use client";

import { useState } from "react";
import UsersTab from "./UsersTab";
import TripsTab from "./TripsTab";
import PaymentsTab from "./PaymentsTab";

const TABS = [
  { id: "users", label: "유저 관리" },
  { id: "trips", label: "트립 관리" },
  { id: "payments", label: "결제 관리" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminDashboard() {
  const [active, setActive] = useState<TabId>("users");

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-2xl font-semibold">관리자 대시보드</h1>

      <div className="mb-6 flex gap-1 border-b">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors ${
              active === tab.id
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {active === "users" && <UsersTab />}
      {active === "trips" && <TripsTab />}
      {active === "payments" && <PaymentsTab />}
    </div>
  );
}
