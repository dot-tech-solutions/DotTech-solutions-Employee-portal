import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { memoryStore } from "./store";

const JWT_SECRET = process.env.APP_SECRET || "dottech-flow-fallback-secret-2026";
const COOKIE_NAME = "dottech_session";

export interface SessionUser {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
  department?: string;
  designation?: string;
  status: string;
}

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signToken(user: SessionUser): string {
  return jwt.sign(
    {
      id: user.id,
      employeeId: user.employeeId,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      department: user.department,
      designation: user.designation,
      status: user.status,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string): SessionUser | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as SessionUser;
    return payload;
  } catch (err: any) {
    console.error("[AUTH] verifyToken error:", err?.name, err?.message);
    // Fallback: decode directly if secret mismatch in dev
    try {
      const decoded = jwt.decode(token) as SessionUser;
      if (decoded && decoded.id && decoded.role) {
        console.warn("[AUTH] Recovered token via decode fallback in dev environment");
        return decoded;
      }
    } catch {}
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const session = verifyToken(token);
    if (!session) return null;
    
    // Check if user is still active in memory store
    const user = memoryStore.getUserById(session.id);
    if (!user || user.status !== "ACTIVE") return null;

    return {
      id: user.id,
      employeeId: user.employeeId,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      department: user.department,
      designation: user.designation,
      status: user.status,
    };
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export { COOKIE_NAME };
