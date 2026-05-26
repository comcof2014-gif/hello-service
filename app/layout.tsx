import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next Start Kit",
  description: "Next.js + Supabase + Tailwind starter kit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
