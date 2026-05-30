import { type ReactNode } from "react"

type Props = {
  icon?: ReactNode
  title: string
  children: ReactNode
  accent?: "blue" | "emerald" | "amber" | "violet" | "rose"
  className?: string
}

const accentBorders = {
  blue: "border-l-blue-500/50",
  emerald: "border-l-emerald-500/50",
  amber: "border-l-amber-500/50",
  violet: "border-l-violet-500/50",
  rose: "border-l-rose-500/50",
}

export default function Card({ icon, title, children, accent = "blue", className = "" }: Props) {
  return (
    <div
      className={`rounded-xl border border-zinc-800/60 bg-zinc-900/50 border-l-2 ${accentBorders[accent]} p-4 backdrop-blur-sm ${className}`}
    >
      <div className="mb-3 flex items-center gap-2">
        {icon && <span className="text-zinc-400">{icon}</span>}
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{title}</h3>
      </div>
      {children}
    </div>
  )
}
