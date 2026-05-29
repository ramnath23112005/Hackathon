import ChatUI from "@/components/ChatUI"

export default function Home() {
  return (
    <main className="flex h-dvh flex-col">
      <header className="flex items-center justify-center border-b border-zinc-800 px-4 py-3">
        <h1 className="text-lg font-semibold tracking-tight">InternetOS</h1>
      </header>
      <ChatUI />
    </main>
  )
}
