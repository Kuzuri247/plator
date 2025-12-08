import { NextResponse } from "next/server";
import { prisma, auth } from "@/lib/auth"; // Your auth/db setup
import { headers } from "next/headers";

// GET: List scheduled posts
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const posts = await prisma.post.findMany({
    where: { 
      userId: session.user.id,
      status: "PENDING"
    },
    orderBy: { scheduledAt: 'asc' }
  });

  return NextResponse.json(posts);
}

// POST: Create a new scheduled post
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();
  const { content, scheduledAt, platforms } = body;

  if (!content || !scheduledAt) {
    return new NextResponse("Missing fields", { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      content,
      scheduledAt: new Date(scheduledAt),
      platforms, // Ensure your array handling matches DB
      userId: session.user.id,
      status: "PENDING"
    }
  });

  return NextResponse.json(post);
}