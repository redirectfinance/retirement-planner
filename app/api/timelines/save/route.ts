import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()

    const timeline = await prisma.timeline.create({
     data: {
      title: body.title,
 
      currency: body.currency,
      birthDate: body.birthDate,

      dailyIncomeTarget: body.dailyIncomeTarget,
      currentSavings: body.currentSavings,
      monthlyInvestment: body.monthlyInvestment,
      expectedReturn: body.expectedReturn,
      inflationRate: body.inflationRate,

      targetWealth: body.targetWealth,
      yearsRequired: body.yearsRequired,
      retirementAge: body.retirementAge,

      userId: session.user.id,
     },
    })

    return NextResponse.json(timeline)

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}