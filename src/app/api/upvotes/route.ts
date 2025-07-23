import { authClient } from "@/app/lib/auth-client";
import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import {string, z} from 'zod'

const UpvoteSchema = z.object({
    streamId: string
})

export async function POST(req: NextRequest){
    const session = await authClient.getSession()

    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.data?.user.email ?? ""
        }
    })

    if(!user){
        return NextResponse.json({
            message: "Unauthenticated"
        }, {
            status: 403
        })
    }

    try {
        const upvote = await UpvoteSchema.parse(req.json())
        await prismaClient.upvote.create({
            data: {
                userId: user.id,
                streamId: upvote.streamId
            }
        })
    } catch (error) {
        return NextResponse.json({
            messgae: "Error in upvoting"
        },{
            status: 403
        })
    }
}