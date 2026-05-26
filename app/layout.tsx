import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import { getAuthUser } from "./lib/auth";

export const metadata: Metadata = {
  title: "AI 여행 플래너",
  description: "AI와 대화하며 나만의 여행 계획을 만들어보세요",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAuthUser();

  return (
    <html lang="ko">
      <body suppressHydrationWarning>
        <Header email={user?.email} />
        {children}
      </body>
    </html>
  );
}
