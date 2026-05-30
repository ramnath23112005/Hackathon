import { motion } from "framer-motion"
import { FileText } from "lucide-react"
import Card from "@/components/ui/Card"

type Props = {
  summary: string
}

export default function ExecutiveSummary({ summary }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card icon={<FileText size={14} />} title="Executive Summary" accent="blue">
        <p className="text-sm leading-relaxed text-zinc-200">{summary}</p>
      </Card>
    </motion.div>
  )
}
