export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center px-6 py-16">
      <main className="w-full max-w-xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
            v0.1.0
          </span>

          <h1 className="text-4xl font-semibold sm:text-5xl">
            start kit에<br />오신걸 환영합니다
          </h1>

          <p className="max-w-md text-base sm:text-lg">
            Next.js · Supabase · Tailwind CSS 기반의<br />
            간결한 스타터 템플릿
          </p>

          <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-full border px-6 text-sm sm:w-40"
            >
              시작하기
            </a>
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full border px-6 text-sm sm:w-40"
            >
              문서 보기
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
