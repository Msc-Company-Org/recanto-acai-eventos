import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "recanto_crm_session";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "recanto-crm-dev-secret-troque-em-producao",
);

export async function signToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}
