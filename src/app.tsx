import { Textarea } from "./components/ui/textarea";
import { Header } from "./components/header/header";
import { Aside } from "./components/aside/aside";
import { useCompletion } from "ai/react"
import { useState } from "react";
export function App() {
  const [videoId, setVideoId] = useState<string | null>(null)
  const [temperature, setTemperature] = useState(0.5)

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading
  } = useCompletion({
    api: 'http://localhost:3333/ai/complete',
    body: {
      videoId,
      temperature,
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 p-6 flex gap-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              value={input}
              onChange={e => handleInputChange(e)}
              className="resize-none p-4 leading-relaxed"
              placeholder="Add a prompt for the AI here..."
            />
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Result generated..."
              value={completion}
            />
            <p>You can use variable <code className="text-red-400">{'{Transcription}'}</code> in your prompt to add transcription content
              from the video uploaded.</p>
          </div>

        </div>
        <Aside
          setInput={setInput}
          temperature={temperature}
          setTemperature={setTemperature}
          setVideoId={setVideoId}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </main>
    </div>
  )
}