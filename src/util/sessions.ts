import { authOptions } from "@/lib/auth";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  return session?.user;
}
export function GetCurrentSessionClient() {
  const session = useSession();

  return session;
}

export async function GetCurrentSession() {
  const session = await getServerSession(authOptions);

  return session;
}

export function GetCurrentUserClient() {
  const { data: session } = useSession();

  return session?.user;
}
