"use client"

import { useState } from "react"

type FeedbackModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function FeedbackModal({
  isOpen,
  onClose,
}: FeedbackModalProps) {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!message.trim()) {
      alert("Please enter feedback.")
      return
    }

    try {
      setLoading(true)

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed")
      }

      alert("Feedback submitted 🔥")
      setMessage("")
      onClose()

    } catch (error) {
      console.error(error)
      alert("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl p-6 shadow-2xl">

        <h2 className="text-xl font-bold text-white mb-4">
          Share Your Feedback
        </h2>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell me what should be improved..."
          className="w-full h-40 p-3 rounded bg-slate-700 text-white resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-500 transition p-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 transition p-2 rounded font-medium"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  )
}