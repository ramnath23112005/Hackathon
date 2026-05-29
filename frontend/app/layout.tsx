import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "InternetOS",
  description: "AI-Powered Autonomous Internet Research Agent",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
