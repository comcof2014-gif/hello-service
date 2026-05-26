import { createClient } from "@/app/lib/supabase/server";
import ChatInterface from "./ChatInterface";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ planId?: string }>;
}) {
  const { planId } = await searchParams;

  let initialMessages: Message[] = [];
  let initialTitle = "";

  if (planId) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("travel_plans")
      .select("title, messages")
      .eq("id", planId)
      .single();

    if (data) {
      initialTitle = data.title;
      initialMessages = data.messages as Message[];
    }
  }

  return (
    <ChatInterface
      planId={planId}
      initialTitle={initialTitle}
      initialMessages={initialMessages}
    />
  );
}
