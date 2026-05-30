"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react"

type SearchStrategy = {
  plan: string
  intent?: string
  search_terms?: string[]
  priority_sources?: string
  reasoning?: string
  focus?: string
}

type AgentStepDef = {
  step: string
  label: string
  icon: string
  progress: number
}

type AgentResult = {
  search_strategy?: SearchStrategy
}

type AgentState = {
  session_id: string
  query: string
  step: string
  status: string
  current_action: string
  progress: number
  logs: string[]
  result: AgentResult | null
  error: string | null
}

type Props = {
  sessionId: string
  steps: AgentStepDef[]
  onComplete: (state: AgentState) => void
  onError: (error: string) => void
}

const stepIcons: Record<string, string> = {
  interpreting: "🧠",
  planning: "📋",
  searching: "🔎",
  collecting: "📡",
  normalizing: "📊",
  analyzing: "🤖",
  synthesizing: "🧾",
  complete: "✅",
}

export default function AgentTimeline({ sessionId, steps, onComplete, onError }: Props) {
  const [state, setState] = useState<AgentState | null>(null)
  const [activeStepIdx, setActiveStepIdx] = useState(-1)
  const bottomRef = useRef<HTMLDivElement>(null)
  const doneRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  const onErrorRef = useRef(onError)
  onCompleteRef.current = onComplete
  onErrorRef.current = onError

  useEffect(() => {
    doneRef.current = false
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    let interval: ReturnType<typeof setInterval> | null = null

    async function poll() {
      if (doneRef.current) return
      try {
        const res = await fetch(`${API_URL}/agent/status/${sessionId}`)
        if (!res.ok) return
        const data: AgentState = await res.json()
        setState(data)
        const idx = steps.findIndex((s) => s.step === data.step)
        if (idx >= 0) setActiveStepIdx(idx)

        if (data.status === "completed" && !doneRef.current) {
          doneRef.current = true
          if (interval) clearInterval(interval)
          onCompleteRef.current(data)
        } else if (data.status === "failed" && !doneRef.current) {
          doneRef.current = true
          if (interval) clearInterval(interval)
          onErrorRef.current(data.error || "Agent execution failed")
        }
      } catch {
        if (!doneRef.current) {
          doneRef.current = true
          if (interval) clearInterval(interval)
          onErrorRef.current("Failed to connect to backend")
        }
      }
    }

    interval = setInterval(poll, 400)
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [sessionId, steps])

  if (!state) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center gap-2.5 text-sm text-zinc-500">
          <Loader2 size={16} className="animate-spin text-blue-400" />
          Initializing agent...
        </div>
      </div>
    )
  }

  const isRunning = state.status === "running"
  const isCompleted = state.status === "completed"
  const isFailed = state.status === "failed"

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Agent Execution
          </h2>
          <AnimatePresence mode="wait">
            {isRunning && (
              <motion.span
                key="running"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] text-blue-400 ring-1 ring-blue-500/20"
              >
                Running
              </motion.span>
            )}
            {isCompleted && (
              <motion.span
                key="done"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-400 ring-1 ring-emerald-500/20"
              >
                Complete
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <p className="mt-1 text-xs text-zinc-600 truncate">
          Researching: &ldquo;{state.query.slice(0, 50)}{state.query.length > 50 ? "..." : ""}&rdquo;
        </p>
      </div>

      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <motion.div
          className={`h-full rounded-full ${
            isFailed
              ? "bg-red-500"
              : isCompleted
                ? "bg-emerald-500"
                : "bg-gradient-to-r from-blue-500 to-violet-500"
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${state.progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="mb-3 rounded-lg bg-zinc-900/50 px-3 py-2 ring-1 ring-zinc-800/50">
        <p className="flex items-center gap-2 text-xs text-zinc-400">
          {isRunning && <Loader2 size={12} className="animate-spin text-blue-400" />}
          {isCompleted && <CheckCircle2 size={12} className="text-emerald-400" />}
          {isFailed && <AlertCircle size={12} className="text-red-400" />}
          {state.current_action}
        </p>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto">
        {steps.map((step, i) => {
          const isDone = i < activeStepIdx
          const isActive = i === activeStepIdx
          const isPending = i > activeStepIdx

          return (
            <motion.div
              key={step.step}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                isActive
                  ? "bg-zinc-800/60 ring-1 ring-zinc-700/50"
                  : isDone
                    ? "bg-zinc-900/30"
                    : "opacity-25"
              }`}
              animate={
                isActive
                  ? { scale: [1, 1.02, 1] }
                  : {}
              }
              transition={isActive ? { duration: 1.5, repeat: Infinity } : {}}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center text-xs">
                {isDone ? (
                  <CheckCircle2 size={16} className="text-emerald-400" />
                ) : isActive ? (
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {stepIcons[step.step] || step.icon}
                  </motion.span>
                ) : (
                  <span className="text-zinc-600">{stepIcons[step.step] || step.icon}</span>
                )}
              </span>

              <span
                className={`flex-1 text-xs ${
                  isActive ? "text-zinc-200 font-medium" : isDone ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                {step.label}
              </span>

              <span className="text-[10px] text-zinc-600 tabular-nums">
                {isDone ? "100%" : isActive ? `${step.progress}%` : "0%"}
              </span>
            </motion.div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {state.result?.search_strategy?.plan === "llm" && (
        <motion.div
          className="mt-3 rounded-lg bg-zinc-900/50 px-3 py-2.5 ring-1 ring-zinc-800/50 space-y-1"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Strategy</p>
          {state.result.search_strategy.intent && (
            <p className="text-xs text-zinc-400">
              <span className="text-zinc-500">Intent:</span> {state.result.search_strategy.intent}
            </p>
          )}
          {state.result.search_strategy.search_terms && (
            <div className="flex flex-wrap gap-1">
              {state.result.search_strategy.search_terms.map((t, i) => (
                <span
                  key={i}
                  className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      )}

      <div className="mt-auto pt-3 border-t border-zinc-800/60">
        {isRunning && (
          <div className="flex items-center gap-2 text-[10px] text-zinc-500">
            <Loader2 size={10} className="animate-spin text-blue-400" />
            Agent active &middot; {state.progress}% complete
          </div>
        )}
        {isCompleted && (
          <div className="flex items-center gap-2 text-[10px] text-zinc-500">
            <CheckCircle2 size={10} className="text-emerald-400" />
            Completed successfully
          </div>
        )}
        {isFailed && (
          <p className="text-[10px] text-red-400">Failed: {state.error}</p>
        )}
      </div>
    </div>
  )
}
