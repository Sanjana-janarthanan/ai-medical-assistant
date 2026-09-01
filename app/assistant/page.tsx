"use client";

import {
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";

import { useSearchParams } from "next/navigation";

type Message = {
  id?: string;
  role: "user" | "assistant";
  content: string;
};

type Conversation = {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
};

const welcomeMessage: Message = {
  role: "assistant",
  content:
    "Hi! I'm your AI Medical Assistant. How can I help you today?",
};

/* =====================================================
   ACTUAL ASSISTANT
===================================================== */

function AssistantClient() {
  const searchParams = useSearchParams();

  const [messages, setMessages] =
    useState<Message[]>([welcomeMessage]);

  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [selectedConversationId, setSelectedConversationId] =
    useState<string | null>(null);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [loadingHistory, setLoadingHistory] =
    useState(true);

  const [loadingConversations, setLoadingConversations] =
    useState(true);

  const [creatingChat, setCreatingChat] =
    useState(false);

  const symptomStarted = useRef(false);

  /* ===================================================
     LOAD CONVERSATIONS
  =================================================== */

  async function loadConversations() {
    try {
      setLoadingConversations(true);

      const response = await fetch(
        "/api/conversations",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to load conversations."
        );
      }

      setConversations(
        data.conversations || []
      );
    } catch (error) {
      console.error(
        "Failed to load conversations:",
        error
      );
    } finally {
      setLoadingConversations(false);
    }
  }

  /* ===================================================
     LOAD SPECIFIC CONVERSATION
  =================================================== */

  async function loadConversation(
    conversationId: string
  ) {
    try {
      setLoadingHistory(true);

      console.log(
        "Loading conversation:",
        conversationId
      );

      const response = await fetch(
        `/api/assistant?conversationId=${encodeURIComponent(
          conversationId
        )}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to load conversation."
        );
      }

      setSelectedConversationId(
        conversationId
      );

      if (
        Array.isArray(data.messages) &&
        data.messages.length > 0
      ) {
        const loadedMessages =
          data.messages.map(
            (message: {
              id?: string;
              role: string;
              content: string;
            }) => ({
              id: message.id,
              role:
                message.role === "user"
                  ? ("user" as const)
                  : ("assistant" as const),
              content: message.content,
            })
          );

        setMessages(loadedMessages);
      } else {
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error(
        "Failed to load conversation:",
        error
      );

      setMessages([
        {
          role: "assistant",
          content:
            "Sorry, I couldn't load this conversation.",
        },
      ]);
    } finally {
      setLoadingHistory(false);
    }
  }

  /* ===================================================
     SEND MESSAGE TO AI
  =================================================== */

  async function sendToAI(
    message: string,
    conversationId: string | null,
    isSymptomChecker = false
  ) {
    try {
      setLoading(true);

      console.log(
        "Sending message to assistant API..."
      );

      const response = await fetch(
        "/api/assistant",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message: message.trim(),
            conversationId,
            isSymptomChecker,
          }),
        }
      );

      const responseText =
        await response.text();

      console.log(
        "Assistant API status:",
        response.status
      );

      console.log(
        "Assistant API response:",
        responseText
      );

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to get AI response."
        );
      }

      if (!data.response) {
        throw new Error(
          "The AI returned an empty response."
        );
      }

      console.log(
        "AI response received successfully."
      );

      if (data.conversationId) {
        setSelectedConversationId(
          data.conversationId
        );
      }

      /* -----------------------------------------------
         SYMPTOM CHECKER
      ------------------------------------------------ */

      if (isSymptomChecker) {
        setMessages([
          {
            role: "user",
            content: message.trim(),
          },
          {
            role: "assistant",
            content: data.response,
          },
        ]);
      }

      /* -----------------------------------------------
         NORMAL CHAT
      ------------------------------------------------ */

      else {
        setMessages((previous) => [
          ...previous,
          {
            role: "assistant",
            content: data.response,
          },
        ]);
      }

      await loadConversations();

      return data;
    } catch (error) {
      console.error(
        "AI request failed:",
        error
      );

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong.";

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            `I couldn't process your request.\n\n${errorMessage}`,
        },
      ]);

      return null;
    } finally {
      setLoading(false);
    }
  }

  /* ===================================================
     INITIALIZATION
  =================================================== */

  useEffect(() => {
    async function initialize() {
      try {
        setLoadingHistory(true);

        /* ---------------------------------------------
           SPECIFIC CONVERSATION
        --------------------------------------------- */

        const conversationId =
          searchParams.get(
            "conversationId"
          );

        if (conversationId) {
          console.log(
            "Specific conversation requested:",
            conversationId
          );

          await loadConversation(
            conversationId
          );

          await loadConversations();

          return;
        }

        /* ---------------------------------------------
           SYMPTOM CHECKER
        --------------------------------------------- */

        const symptomMessage =
          searchParams.get("message");

        if (
          symptomMessage &&
          !symptomStarted.current
        ) {
          symptomStarted.current = true;

          console.log(
            "Symptom Checker message detected."
          );

          setMessages([
            {
              role: "user",
              content: symptomMessage,
            },
          ]);

          await sendToAI(
            symptomMessage,
            null,
            true
          );

          return;
        }

        /* ---------------------------------------------
           NORMAL ASSISTANT
        --------------------------------------------- */

        await loadConversations();

        const response = await fetch(
          "/api/conversations",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to load conversations."
          );
        }

        const list =
          data.conversations || [];

        setConversations(list);

        if (list.length > 0) {
          await loadConversation(
            list[0].id
          );
        } else {
          setMessages([
            welcomeMessage,
          ]);
        }
      } catch (error) {
        console.error(
          "Assistant initialization failed:",
          error
        );

        setMessages([
          {
            role: "assistant",
            content:
              "Unable to load the AI Medical Assistant. Please refresh the page and try again.",
          },
        ]);
      } finally {
        setLoadingHistory(false);
        setLoadingConversations(false);
      }
    }

    initialize();

    // Intentionally initialize once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ===================================================
     NEW CHAT
  =================================================== */

  async function handleNewChat() {
    if (creatingChat || loading) {
      return;
    }

    try {
      setCreatingChat(true);

      const response = await fetch(
        "/api/conversations",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title: "New conversation",
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to create conversation."
        );
      }

      const newConversation =
        data.conversation;

      if (newConversation) {
        setConversations(
          (previous) => [
            newConversation,
            ...previous,
          ]
        );

        setSelectedConversationId(
          newConversation.id
        );
      }

      setMessages([
        welcomeMessage,
      ]);

      setInput("");
    } catch (error) {
      console.error(
        "Failed to create new chat:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to create new chat."
      );
    } finally {
      setCreatingChat(false);
    }
  }

  /* ===================================================
     NORMAL CHAT SUBMIT
  =================================================== */

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (
      !input.trim() ||
      loading
    ) {
      return;
    }

    const userMessage =
      input.trim();

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setInput("");

    await sendToAI(
      userMessage,
      selectedConversationId,
      false
    );
  }

  /* ===================================================
     UI
  =================================================== */

  return (
    <main className="flex min-h-screen bg-gray-50">

      {/* =============================================
          LEFT SIDEBAR
      ============================================== */}

      <aside className="flex w-72 flex-col border-r bg-white">

        <div className="border-b p-5">

          <h2 className="text-lg font-bold text-gray-900">
            AI Medical Assistant
          </h2>

          <button
            type="button"
            onClick={handleNewChat}
            disabled={
              creatingChat ||
              loading
            }
            className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {creatingChat
              ? "Creating..."
              : "+ New Chat"}
          </button>

        </div>

        <div className="flex-1 overflow-y-auto p-3">

          <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Previous Chats
          </p>

          {loadingConversations ? (
            <div className="px-2 py-3 text-sm text-gray-500">
              Loading chats...
            </div>
          ) : conversations.length ===
            0 ? (
            <div className="rounded-xl bg-gray-50 px-3 py-4 text-center text-sm text-gray-500">
              No previous conversations.
            </div>
          ) : (
            <div className="space-y-2">

              {conversations.map(
                (conversation) => {

                  const selected =
                    selectedConversationId ===
                    conversation.id;

                  return (
                    <button
                      key={
                        conversation.id
                      }
                      type="button"
                      onClick={() =>
                        loadConversation(
                          conversation.id
                        )
                      }
                      className={`w-full rounded-xl px-3 py-3 text-left transition ${
                        selected
                          ? "bg-blue-100 text-blue-900"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >

                      <p className="truncate text-sm font-medium">
                        {conversation.title ||
                          "New conversation"}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(
                          conversation.updatedAt
                        ).toLocaleDateString()}
                      </p>

                    </button>
                  );
                }
              )}

            </div>
          )}

        </div>

      </aside>

      {/* =============================================
          MAIN AREA
      ============================================== */}

      <section className="flex min-w-0 flex-1 flex-col">

        <header className="flex h-[73px] items-center border-b bg-white px-8">

          <div>

            <h1 className="text-2xl font-bold text-gray-900">
              AI Medical Assistant
            </h1>

            <p className="text-sm text-gray-500">
              Your personal health companion
            </p>

          </div>

        </header>

        {/* ===========================================
            MESSAGES
        ============================================ */}

        <div className="flex-1 overflow-y-auto">

          <div className="mx-auto w-full max-w-4xl space-y-6 px-6 py-8">

            {loadingHistory ? (

              <div className="flex justify-center">

                <div className="rounded-xl border bg-white px-5 py-3 text-sm text-gray-500 shadow-sm">
                  Loading conversation...
                </div>

              </div>

            ) : (

              messages.map(
                (
                  message,
                  index
                ) => (

                  <div
                    key={
                      message.id ||
                      `${index}-${message.role}`
                    }
                    className={`flex ${
                      message.role ===
                      "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-5 py-4 ${
                        message.role ===
                        "user"
                          ? "bg-blue-600 text-white"
                          : "border bg-white text-gray-800 shadow-sm"
                      }`}
                    >

                      {message.content}

                    </div>

                  </div>

                )
              )

            )}

            {loading && (

              <div className="flex justify-start">

                <div className="rounded-2xl border bg-white px-5 py-4 text-gray-600 shadow-sm">
                  AI is analyzing your information...
                </div>

              </div>

            )}

          </div>

        </div>

        {/* ===========================================
            INPUT
        ============================================ */}

        <div className="border-t bg-gray-50">

          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-4xl px-6 py-6"
          >

            <div className="flex gap-3">

              <input
                type="text"
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                disabled={
                  loading ||
                  creatingChat
                }
                placeholder="Ask a health question..."
                className="flex-1 rounded-xl border bg-white px-5 py-4 text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />

              <button
                type="submit"
                disabled={
                  loading ||
                  creatingChat ||
                  !input.trim()
                }
                className="rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loading
                  ? "Sending..."
                  : "Send"}
              </button>

            </div>

            <p className="mt-3 text-center text-xs text-gray-500">
              This assistant provides general
              health information and does not
              replace professional medical advice.
            </p>

          </form>

        </div>

      </section>

    </main>
  );
}

/* =====================================================
   PAGE WRAPPER

   This Suspense boundary fixes the Next.js 16
   useSearchParams() production build error.
===================================================== */

export default function AssistantPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="rounded-xl border bg-white px-6 py-4 text-gray-600 shadow-sm">
            Loading AI Medical Assistant...
          </div>
        </main>
      }
    >
      <AssistantClient />
    </Suspense>
  );
}