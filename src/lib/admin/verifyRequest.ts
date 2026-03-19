import "server-only";
import { type NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, COOKIE_NAME } from "./auth";

export async function verifyAdminRequest(
  request: NextRequest
): Promise<NextResponse | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  return null;
}
