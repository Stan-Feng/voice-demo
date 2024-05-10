'use client' // This is a client component
import React, { useState, useRef, ChangeEvent } from 'react'
import Image from 'next/image'

export default function Home() {
  interface SearchBarProps {
    inputValue: string
    setInputValue: React.Dispatch<React.SetStateAction<string>>
  }

  const SearchBar: React.FC<SearchBarProps> = ({
    inputValue,
    setInputValue,
  }) => (
    <input
      className="w-full h-12 mt-8 px-4 rounded text-lg bg-white"
      type="text"
      placeholder="Tap to start entering keywords"
      value={inputValue}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        setInputValue(e.target.value)
      }
    />
  )

  const Options = () => (
    <div className="mt-8 text-white">
      {['Option 1', 'Option 2', 'Option 3'].map((option) => (
        <div key={option} className="py-2 flex justify-between items-center">
          <h2 className="text-xl">{option}</h2>
          <button className="py-2 px-4">&gt;</button>
        </div>
      ))}
    </div>
  )

  interface RecordingButtonProps {
    recording: boolean
    startRecording: () => void
    stopRecording: () => void
  }

  const RecordingButton: React.FC<RecordingButtonProps> = ({
    recording,
    startRecording,
    stopRecording,
  }) => (
    <button
      className="w-16 h-16 rounded-full bg-white mt-8"
      onClick={recording ? stopRecording : startRecording}
    >
      {/* Replace with suitable play/stop icons */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-6 h-6 m-auto"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 19L18 12 6 5z"
        />
      </svg>
    </button>
  )

  const [inputValue, setInputValue] = useState('')
  const [recording, setRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const newMediaRecorder = new MediaRecorder(stream)
        setMediaRecorder(newMediaRecorder)
        newMediaRecorder.start()

        newMediaRecorder.ondataavailable = (e) => {
          chunks.current.push(e.data)
        }

        newMediaRecorder.onstop = () => {
          const blob = new Blob(chunks.current, { type: 'audio/webm' })
          const audioURL = URL.createObjectURL(blob)
          chunks.current = []

          // Create a temporary download link and click it programmatically:
          const link = document.createElement('a')
          link.href = audioURL
          link.download = 'audio_recording.webm'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }

        setRecording(true)
      })
      .catch((err) => console.log(err))
  }

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      setRecording(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SearchBar inputValue={inputValue} setInputValue={setInputValue} />
      <Options />
      <RecordingButton
        recording={recording}
        startRecording={startRecording}
        stopRecording={stopRecording}
      />
    </main>
  )
}
