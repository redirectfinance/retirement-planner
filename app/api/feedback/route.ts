import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    const body = await req.json()

    if (!body.message) {
      return NextResponse.json(
        { error: "Feedback is required" },
        { status: 400 }
      )
    }

    const feedback = await prisma.feedback.create({
      data: {
        message: body.message,

        userId: session?.user?.id || null,
      },
    })

    return NextResponse.json(feedback)

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}