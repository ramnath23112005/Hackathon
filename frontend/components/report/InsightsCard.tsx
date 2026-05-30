import { motion } from "framer-motion"
import { Lightbulb } from "lucide-react"
import Card from "@/components/ui/Card"

type Props = {
  insights: string[]
}

export default function InsightsCard({ insights }: Props) {
  if (!insights.length) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
    >
      <Card icon={<Lightbulb size={14} />} title="Insights" accent="violet">
        <ul className="space-y-2">
          {insights.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </motion.div>
  )
}
