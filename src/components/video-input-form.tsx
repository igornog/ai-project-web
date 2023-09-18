
import { Separator } from "@radix-ui/react-separator"
import { FileVideo, Upload } from "lucide-react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react"
import { getFFmpeg } from "@/lib/ffmpeg"
import { fetchFile } from "@ffmpeg/util"
import { api } from "@/lib/axios"

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success'

const statusMessages = {
  converting: 'Converting...',
  uploading: 'Uploading...',
  generating: 'Generating...',
  success: 'Success',
}

interface onVideoUploadedProps {
  onVideoUploaded: (id: string) => void
}

export function VideoInputForm(props: onVideoUploadedProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>('waiting')

  const promptInputRef = useRef<HTMLTextAreaElement>(null)

  function handleVideoSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setVideoFile(file)
  }

  async function convertVideoToAudio(video: File) {

    const ffmpeg = await getFFmpeg()

    await ffmpeg.writeFile('input.mp4', await fetchFile(video))
    ffmpeg.on('progress', progress => {
      console.log('Convert progress: ' + Math.round(progress.progress) * 100)
    })

    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-map",
      "0:a",
      "-b:a",
      "20k",
      "-acodec",
      "libmp3lame",
      "output.mp3",
    ])


    const data = await ffmpeg.readFile('output.mp3')


    const audioFileBlob = new Blob([data], { type: 'audio/mpeg' })
    const audioFile = new File([audioFileBlob], 'output.mp3', { type: 'audio/mpeg' })

    console.log('Converted audio file')
    return audioFile
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const prompt = promptInputRef.current?.value

    if (!videoFile) {
      console.log('No video file selected')
      return
    }

    // convert video to audio
    setStatus('converting')
    const audioFile = await convertVideoToAudio(videoFile)

    const data = new FormData()
    data.append('file', audioFile)

    // upload audio file
    setStatus('uploading')
    const response = await api.post('/videos', data)
    const videoId = response.data.id

    // convert audio to text
    setStatus('generating')
    await api.post(`/videos/${videoId}/transcription`, {
      prompt,
    })

    setStatus('success')
    props.onVideoUploaded(videoId)
  }

  const previewURL = useMemo(() => {
    if (!videoFile) return null

    return URL.createObjectURL(videoFile)
  }, [videoFile])

  return (
    <form className="space-y-4" onSubmit={handleUploadVideo}>
      <label
        className="relative overflow-hidden flex border space-y-6 rounded-md aspect-video cursor-pointer text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-gray-100/5"
        htmlFor="video"
      >
        {previewURL ? (
          <video src={previewURL} controls={false} className="absolute inset-0 object-cover pointer-events-none" />
        ) : (
          <>
            <FileVideo className="w-4 h-4" />
            Select a video
          </>
        )}
      </label>
      <Separator />
      <div className="space-y-1">
        <Label
          htmlFor="transcription_prompt"
        >
          Transcription prompt
        </Label>
        <Textarea
          ref={promptInputRef}
          disabled={status !== 'waiting'}
          id="transcription_prompt"
          className="h-20 leading-relaxed"
          placeholder="Add words mentioned in the video above, separated by comma (,)"
        />
      </div>

      <Button
        data-success={status === 'success'}
        disabled={status !== 'waiting'}
        type="submit"
        className="w-full data-[success=true]:bg-emerald-800 transition-colors"
      >
        {status === 'waiting' ? (
          <>
            Upload video
            <Upload className="w-4 h-4 ml-2" />
          </>
        ) :
          statusMessages[status]}

      </Button>
      <input className="border rounded-md sr-only" type="file" id="video" accept="video/mp4" onChange={handleVideoSelected} />
    </form>
  )
}
