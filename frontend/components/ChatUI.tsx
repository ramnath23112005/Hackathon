"use client"

import { FormEvent, useState, useRef, useEffect } from "react"

type Source = {
  source: string
  error: string | null
  count: number
}

type ResultItem = {
  source: string
  title: string
  text: string
  url: string
  author: string
  date: string
}

type NormalizedData = {
  summary_context: string
  key_entities: string[]
  trends: string[]
  sources: Source[]
  results: ResultItem[]
}

type ChatResponse = {
  query: string
  sources: Source[]
  data: NormalizedData
  raw_wire_response: unknown[] | null
}

type Message = {
  role: "user" | "assistant"
  content: string
  response?: ChatResponse
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
      const data: ChatResponse = await res.json()
      const assistantMsg: Message = {
        role: "assistant",
        content: `InternetOS processed: "${data.query}"`,
        response: data,
      }
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
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {messages.map((msg, i) => (
            <div key={i}>
              {msg.role === "user" ? (
                <div className="rounded-xl bg-zinc-800 px-4 py-3 text-sm leading-relaxed text-zinc-100 self-end max-w-[80%] ml-auto">
                  {msg.content}
                </div>
              ) : (
                <div className="rounded-xl bg-zinc-900 px-4 py-3 text-sm leading-relaxed text-zinc-300 self-start max-w-full">
                  {msg.content}
                  {msg.response && (
                    <div className="mt-3 space-y-3 border-t border-zinc-700 pt-3">
                      {/* Sources */}
                      <div>
                        <p className="mb-1 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                          Sources
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.response.sources.map((s, j) => (
                            <span
                              key={j}
                              className={`rounded px-2 py-0.5 text-xs ${
                                s.error
                                  ? "bg-red-900/40 text-red-300"
                                  : "bg-zinc-800 text-zinc-200"
                              }`}
                            >
                              {s.source}: {s.count}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Summary */}
                      {msg.response.data.summary_context && (
                        <div>
                          <p className="mb-1 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                            Summary
                          </p>
                          <p className="text-xs text-zinc-400 leading-relaxed">
                            {msg.response.data.summary_context}
                          </p>
                        </div>
                      )}

                      {/* Entities */}
                      {msg.response.data.key_entities.length > 0 && (
                        <div>
                          <p className="mb-1 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                            Entities
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.response.data.key_entities.map((e, j) => (
                              <span
                                key={j}
                                className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300"
                              >
                                {e}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Results */}
                      {msg.response.data.results.length > 0 && (
                        <div>
                          <p className="mb-1 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                            Results ({msg.response.data.results.length})
                          </p>
                          <div className="space-y-2">
                            {msg.response.data.results.slice(0, 5).map((r, j) => (
                              <div key={j} className="rounded bg-zinc-800/50 p-2 text-xs">
                                <p className="text-zinc-200 font-medium truncate">
                                  {r.title || "(no title)"}
                                </p>
                                <p className="text-zinc-400 mt-0.5 line-clamp-2">
                                  {r.text}
                                </p>
                                <div className="flex gap-2 mt-1 text-zinc-500">
                                  <span>{r.source}</span>
                                  {r.author && <span>by {r.author}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="self-start rounded-xl bg-zinc-900 px-4 py-3 text-sm text-zinc-400">
              Searching Reddit, News, Web...
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
