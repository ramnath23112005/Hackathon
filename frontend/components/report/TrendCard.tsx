import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"
import Card from "@/components/ui/Card"

type Props = {
  trends: string[]
}

export default function TrendCard({ trends }: Props) {
  if (!trends.length) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
    >
      <Card icon={<TrendingUp size={14} />} title="Key Trends" accent="emerald">
        <div className="flex flex-wrap gap-1.5">
          {trends.map((t, i) => (
            <span
              key={i}
              className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300 ring-1 ring-emerald-500/20"
            >
              {t}
            </span>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
