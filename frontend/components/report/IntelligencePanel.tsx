import { motion } from "framer-motion"
import ExecutiveSummary from "./ExecutiveSummary"
import TrendCard from "./TrendCard"
import InsightsCard from "./InsightsCard"
import OpportunitiesCard from "./OpportunitiesCard"
import RisksCard from "./RisksCard"
import SourcesCard from "./SourcesCard"

type Props = {
  intelligence: {
    summary: string
    key_trends: string[]
    insights: string[]
    opportunities: string[]
    risk_signals: string[]
    source_attribution: string[]
  }
}

export default function IntelligencePanel({ intelligence }: Props) {
  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4 flex items-center gap-2 border-b border-zinc-800 pb-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Intelligence Report
        </h2>
        <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-400 ring-1 ring-emerald-500/20">
          AI-Generated
        </span>
      </div>

      <ExecutiveSummary summary={intelligence.summary} />
      <TrendCard trends={intelligence.key_trends} />
      <InsightsCard insights={intelligence.insights} />
      <OpportunitiesCard opportunities={intelligence.opportunities} />
      <RisksCard risks={intelligence.risk_signals} />
      <SourcesCard sources={intelligence.source_attribution} />
    </motion.div>
  )
}
