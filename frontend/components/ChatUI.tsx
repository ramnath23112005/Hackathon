"use client"

import { FormEvent, useState, useRef, useEffect } from "react"

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg: Message = { role: "user", content: input.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      })
      const data = await res.json()
      const assistantMsg: Message = { role: "assistant", content: data.reply }
      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      const errorMsg: Message = {
        role: "assistant",
        content: "Error connecting to backend. Make sure the server is running.",
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-zinc-500 text-sm">Ask InternetOS anything...</p>
          </div>
        )}
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-zinc-800 text-zinc-100 self-end max-w-[80%]"
                  : "bg-zinc-900 text-zinc-300 self-start max-w-[90%]"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="self-start rounded-xl bg-zinc-900 px-4 py-3 text-sm text-zinc-400">
              Thinking...
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-zinc-800 p-4"
      >
        <div className="mx-auto flex max-w-2xl gap-2">
          <input
            className="flex-1 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-zinc-600"
            placeholder="Type your research query..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-300 disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
