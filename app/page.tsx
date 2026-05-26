import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-4xl font-semibold sm:text-5xl">
        AI 여행 플래너
      </h1>
      <p className="mt-4 max-w-md text-base text-gray-500 sm:text-lg">
        목적지와 기간을 알려주세요.<br />
        AI가 맞춤 여행 일정을 만들어드립니다.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/login"
          className="inline-flex h-12 items-center justify-center rounded-full bg-black px-8 text-sm text-white"
        >
          시작하기
        </Link>
        <Link
          href="/signup"
          className="inline-flex h-12 items-center justify-center rounded-full border px-8 text-sm"
        >
          회원가입
        </Link>
      </div>

      <div className="mt-16 grid max-w-2xl grid-cols-1 gap-6 text-left sm:grid-cols-3">
        {[
          { title: "맞춤 일정", desc: "여행 스타일에 맞게 날짜별 세부 일정을 제안해드립니다." },
          { title: "실시간 대화", desc: "AI와 대화하며 원하는 방향으로 계획을 수정할 수 있습니다." },
          { title: "계획 저장", desc: "작성한 여행 계획을 저장하고 언제든지 다시 확인하세요." },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border p-5">
            <p className="font-medium">{item.title}</p>
            <p className="mt-1.5 text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
