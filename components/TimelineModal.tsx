"use client"

import { useEffect, useState } from "react"

interface Timeline {
  id: string
  title: string

  currency: string
  birthDate: string

  dailyIncomeTarget: number
  currentSavings: number
  monthlyInvestment: number
  expectedReturn: number
  inflationRate: number

  targetWealth: number
  yearsRequired: number
  retirementAge: number

  createdAt: string
}

interface TimelineModalProps {
  isOpen: boolean
  onClose: () => void
  onLoadTimeline: (timeline: any) => void
}

export default function TimelineModal({
  isOpen,
  onClose,
  onLoadTimeline,
}: TimelineModalProps) {

  const [timelines, setTimelines] = useState<Timeline[]>([])
  const [loading, setLoading] = useState(false)
    const handleDelete = async (id: string) => {
    console.log("Deleting ID:", id)
    try {
        const res = await fetch(`/api/timelines/delete/${id}`, {
        method: "DELETE",
        })

        if (!res.ok) {
        throw new Error("Failed to delete")
        }

        setTimelines((prev) =>
        prev.filter((timeline) => timeline.id !== id)
        )

    } catch (error) {
        console.error(error)
        alert("Failed to delete timeline")
    }
    }


  useEffect(() => {
    if (!isOpen) return

    const fetchTimelines = async () => {
      try {
        setLoading(true)

        const res = await fetch("/api/timelines")

        const data = await res.json()

        setTimelines(data)

      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchTimelines()
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      
      <div className="bg-slate-800 p-6 rounded-xl max-w-lg w-full relative shadow-xl text-white">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">
          📂 My Saved Timelines
        </h2>

        {loading ? (
          <p className="text-gray-400">
            Loading timelines...
          </p>
        ) : timelines.length === 0 ? (
          <p className="text-gray-400">
            No saved timelines yet.
          </p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {timelines.map((timeline) => (
              <div
                key={timeline.id}
                className="bg-slate-700 p-4 rounded-lg"
              >
                <h3 className="font-semibold">
                  {timeline.title}
                </h3>

                <p className="text-sm text-gray-300 mt-1">
                  Retire in {timeline.yearsRequired.toFixed(2)} years
                </p>

                <p className="text-sm text-gray-400">
                  Retirement age: {timeline.retirementAge.toFixed(2)}
                </p>

                <div className="flex gap-2 mt-3">

                  <button
                    onClick={() => {
                        onLoadTimeline(timeline)
                        onClose()
                    }}                  
                    className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-sm"
                  >
                    Load
                  </button>

                  <button
                    onClick={() => handleDelete(timeline.id)}
                    className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-sm"
                  >
                    Delete
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}