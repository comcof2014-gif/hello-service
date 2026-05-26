"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  planId?: string;
  initialTitle?: string;
  initialMessages?: Message[];
}

export default function ChatInterface({
  planId: initialPlanId,
  initialTitle = "",
  initialMessages = [],
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [planId, setPlanId] = useState(initialPlanId);
  const [saveTitle, setSaveTitle] = useState(initialTitle);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok || !res.body) throw new Error("응답 오류");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: assistantText },
        ]);
      }

      if (planId) {
        const finalMessages: Message[] = [
          ...newMessages,
          { role: "assistant", content: assistantText },
        ];
        await fetch(`/api/plans/${planId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: saveTitle, messages: finalMessages }),
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "오류가 발생했습니다. 다시 시도해 주세요." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!saveTitle.trim() || saveStatus === "saving") return;
    setSaveStatus("saving");

    const res = await fetch("/api/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: saveTitle.trim(), messages }),
    });

    const json = await res.json();
    if (json.success) {
      setPlanId(json.data.id);
      setSaveStatus("saved");
      setShowSaveForm(false);
      window.history.replaceState(null, "", `/chat?planId=${json.data.id}`);
    } else {
      setSaveStatus("idle");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e as unknown as React.FormEvent);
    }
  }

  return (
    <div className="flex h-[calc(100vh-57px)] flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {messages.length === 0 && (
            <div className="mt-16 text-center">
              <p className="text-2xl font-semibold">어디로 여행을 떠나고 싶으신가요?</p>
              <p className="mt-2 text-sm text-gray-500">
                목적지, 기간, 여행 스타일을 알려주시면 맞춤 계획을 세워드릴게요.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {["도쿄 3박 4일 혼자 여행", "유럽 배낭여행 2주", "제주도 가족 여행 4박 5일"].map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setInput(suggestion)}
                      className="rounded-full border px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      {suggestion}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={msg.role === "user" ? "flex justify-end" : "flex"}>
              <div
                className={
                  msg.role === "user"
                    ? "max-w-[80%] rounded-2xl bg-black px-4 py-3 text-sm text-white"
                    : "max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap"
                }
              >
                {msg.content}
                {msg.role === "assistant" && loading && i === messages.length - 1 && (
                  <span className="ml-1 inline-block h-3 w-0.5 animate-pulse bg-gray-400" />
                )}
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Save bar */}
      {messages.length > 0 && !planId && (
        <div className="border-t px-4 py-2">
          <div className="mx-auto max-w-2xl">
            {showSaveForm ? (
              <form onSubmit={handleSave} className="flex gap-2">
                <input
                  type="text"
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  placeholder="계획 이름 입력"
                  autoFocus
                  className="flex-1 rounded-lg border px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-black"
                />
                <button
                  type="submit"
                  disabled={saveStatus === "saving"}
                  className="rounded-lg bg-black px-4 py-1.5 text-sm text-white disabled:opacity-50"
                >
                  {saveStatus === "saving" ? "저장 중..." : "저장"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSaveForm(false)}
                  className="rounded-lg border px-4 py-1.5 text-sm"
                >
                  취소
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowSaveForm(true)}
                className="text-sm text-gray-500 hover:text-black"
              >
                이 계획 저장하기
              </button>
            )}
          </div>
        </div>
      )}

      {planId && saveStatus !== "saved" && (
        <div className="border-t px-4 py-2">
          <p className="mx-auto max-w-2xl text-xs text-gray-400">
            자동 저장 중 — {saveTitle}
          </p>
        </div>
      )}

      {/* Input */}
      <div className="border-t px-4 py-4">
        <form onSubmit={sendMessage} className="mx-auto max-w-2xl">
          <div className="flex items-end gap-2 rounded-2xl border px-4 py-3 focus-within:ring-1 focus-within:ring-black">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요 (Shift+Enter로 줄바꿈)"
              rows={1}
              disabled={loading}
              className="flex-1 resize-none bg-transparent text-sm outline-none disabled:opacity-50"
              style={{ maxHeight: "120px" }}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex-shrink-0 rounded-full bg-black p-1.5 text-white disabled:opacity-30"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
