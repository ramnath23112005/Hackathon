"use client"

import { useEffect, useState, useRef } from "react"

type AgentStepDef = {
  step: string
  label: string
  icon: string
  progress: number
}

type AgentState = {
  session_id: string
  query: string
  step: string
  status: string
  current_action: string
  progress: number
  logs: string[]
  result: unknown | null
  error: string | null
  created_at: string
}

type Props = {
  sessionId: string
  steps: AgentStepDef[]
  onComplete: (state: AgentState) => void
  onError: (error: string) => void
}

export default function AgentTimeline({ sessionId, steps, onComplete, onError }: Props) {
  const [state, setState] = useState<AgentState | null>(null)
  const [activeStepIdx, setActiveStepIdx] = useState(-1)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

    async function poll() {
      try {
        const res = await fetch(`${API_URL}/agent/status/${sessionId}`)
        if (!res.ok) return
        const data: AgentState = await res.json()
        setState(data)

        const idx = steps.findIndex((s) => s.step === data.step)
        if (idx >= 0) setActiveStepIdx(idx)

        if (data.status === "completed") {
          if (pollingRef.current) clearInterval(pollingRef.current)
          onComplete(data)
        } else if (data.status === "failed") {
          if (pollingRef.current) clearInterval(pollingRef.current)
          onError(data.error || "Agent execution failed")
        }
      } catch {
        if (pollingRef.current) clearInterval(pollingRef.current)
        onError("Failed to connect to backend")
      }
    }

    pollingRef.current = setInterval(poll, 400)
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [sessionId, steps, onComplete, onError])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [state?.logs])

  if (!state) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center gap-2 text-zinc-500 text-sm">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-zinc-300" />
          Initializing agent...
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wide">Agent Execution</h2>
        <p className="mt-1 text-xs text-zinc-500 truncate">
          Researching: &ldquo;{state.query.slice(0, 60)}{state.query.length > 60 ? "..." : ""}&rdquo;
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            state.status === "failed"
              ? "bg-red-500"
              : state.status === "completed"
                ? "bg-emerald-500"
                : "bg-gradient-to-r from-blue-500 to-violet-500"
          }`}
          style={{ width: `${state.progress}%` }}
        />
      </div>

      {/* Current action */}
      <div className="mb-3 rounded-lg bg-zinc-800/50 px-3 py-2">
        <p className="text-xs text-zinc-400">
          {state.status === "running" && (
            <span className="inline-block mr-1.5 h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          )}
          {state.status === "failed" && <span className="mr-1.5">❌</span>}
          {state.status === "completed" && <span className="mr-1.5">✅</span>}
          {state.current_action}
        </p>
      </div>

      {/* Step timeline */}
      <div className="flex-1 space-y-1 overflow-y-auto">
        {steps.map((step, i) => {
          const isDone = i < activeStepIdx
          const isActive = i === activeStepIdx
          const isPending = i > activeStepIdx

          return (
            <div
              key={step.step}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-300 ${
                isActive
                  ? "bg-zinc-800/70 ring-1 ring-zinc-700"
                  : isDone
                    ? "bg-zinc-800/20"
                    : "opacity-30"
              }`}
            >
              {/* Icon */}
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center text-xs transition-all duration-300 ${
                  isActive ? "scale-110" : ""
                }`}
              >
                {isDone ? (
                  <span className="text-emerald-400">✓</span>
                ) : isActive ? (
                  <span className="animate-pulse">{step.icon}</span>
                ) : (
                  <span className="text-zinc-600">{step.icon}</span>
                )}
              </span>

              {/* Label */}
              <span
                className={`flex-1 text-xs ${
                  isActive ? "text-zinc-200 font-medium" : isDone ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                {step.label}
              </span>

              {/* Progress dots */}
              <span className="text-[10px] text-zinc-500 tabular-nums">
                {isDone ? "100%" : isActive ? `${step.progress}%` : "0%"}
              </span>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Details footer */}
      {state.status === "running" && (
        <div className="mt-auto pt-3 border-t border-zinc-800">
          <div className="flex items-center gap-2 text-[10px] text-zinc-500">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Agent active &middot; {state.progress}% complete
          </div>
        </div>
      )}
      {state.status === "failed" && (
        <div className="mt-auto pt-3 border-t border-zinc-800">
          <p className="text-[10px] text-red-400">Agent failed: {state.error}</p>
        </div>
      )}
    </div>
  )
}
