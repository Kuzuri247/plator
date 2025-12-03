import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id }
  });

  const twitterAccount = accounts.find(a => a.providerId === "twitter");
  const linkedinAccount = accounts.find(a => a.providerId === "linkedin");


  if (twitterAccount) {
     const accessToken = twitterAccount.accessToken;

  }

  return NextResponse.json({ success: true });
}