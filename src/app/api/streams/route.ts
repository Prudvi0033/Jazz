import { prismaClient } from "@/app/lib/db";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { z } from "zod";

const createStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const data = createStreamSchema.parse(await req.json());
    const isYt = data.url.includes("youtube");
    if (!isYt) {
      return Response.json(
        {
          message: "Error while adding stream",
        },
        {
          status: 411,
        }
      );
    }

    const extractedId = data.url.split("?v=")[1]

    await prismaClient.stream.create({
        data: {
            userId: data.creatorId,
            url: data.url,
            extractedId,
            type: "Youtube"
        }
    })

    return Response.json({
        message: "Stream added succesfully"
    }, {status: 200})
  } catch (e) {
    return Response.json(
      {
        message: "Error while adding stream",
      },
      {
        status: 411,
      }
    );
  }
}
