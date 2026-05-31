import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Cpu } from "lucide-react"

type HealthStatus = {
  status: string
  llm: { status: string; provider: string; model: string }
  wire: { status: string; configured: boolean }
}

type BadgeProps = {
  label: string
  ok: boolean | null
  pulse?: boolean
}

function Badge({ label, ok, pulse }: BadgeProps) {
  const base = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1"

  if (pulse && ok) {
    return (
      <motion.span
        className={`${base} bg-emerald-500/10 text-emerald-400 ring-emerald-500/20`}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        {label}
      </motion.span>
    )
  }

  const color =
    ok === true
      ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
      : ok === false
        ? "bg-red-500/10 text-red-400 ring-red-500/20"
        : "bg-zinc-500/10 text-zinc-400 ring-zinc-500/20"

  return (
    <span className={`${base} ${color}`}>
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          ok === true
            ? "bg-emerald-400"
            : ok === false
              ? "bg-red-400"
              : "bg-zinc-400"
        }`}
      />
      {label}
    </span>
  )
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function Header() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [backendOk, setBackendOk] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false

    async function check() {
      try {
        const res = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(15000) })
        if (cancelled) return
        if (res.ok) {
          const data: HealthStatus = await res.json()
          setHealth(data)
          setBackendOk(true)
        } else {
          setBackendOk(null)
        }
      } catch {
        if (!cancelled) setBackendOk(null)
      }
    }

    check()
    const interval = setInterval(check, 10000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return (
    <header className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-6 py-3 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600">
          <Cpu size={16} className="text-white" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-zinc-100">InternetOS</h1>
          <p className="text-[10px] text-zinc-500">AI-Native Research Operating System</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Badge label="LIVE" ok={backendOk} pulse />
        <Badge label="Backend" ok={backendOk} />
        <Badge
          label="Wire"
          ok={health ? health.wire.status === "connected" : null}
        />
        <Badge
          label="LLM"
          ok={health ? health.llm.status === "connected" : null}
        />
        {health?.llm.provider === "ollama" && (
          <Badge label={health.llm.model} ok={health.llm.status === "connected"} />
        )}
        <Badge
          label="Anakin Wire"
          ok={health ? health.wire.configured : null}
        />
      </div>
    </header>
  )
}
