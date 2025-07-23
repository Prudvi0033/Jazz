import { authClient } from "@/app/lib/auth-client";
import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const DownvoteSchema = z.object({
  streamId: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await authClient.getSession();

  const user = await prismaClient.user.findFirst({
    where: {
      email: session?.data?.user.email ?? "",
    },
  });

  if (!user) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 403 });
  }

  try {
    const downvote = await DownvoteSchema.parse(req.json());
    await prismaClient.upvote.delete({
      where: {
        userId_streamId: {
          userId: user.id,
          streamId: downvote.streamId,
        },
      },
    });

    return NextResponse.json(
      { message: "Downvote (remove upvote) successful" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error in downvoting" },
      { status: 400 }
    );
  }
}
