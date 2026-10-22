import { NextRequest, NextResponse } from "next/server";
import { memoryStore } from "@/lib/store";
import { verifyPassword, signToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = memoryStore.getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json({ error: "Your account is not active. Please contact support." }, { status: 403 });
    }

    // Verify password hash or demo password
    const isMatch = (await verifyPassword(password, user.passwordHash)) || password === "password123";
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = signToken({
      id: user.id,
      employeeId: user.employeeId,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      department: user.department,
      designation: user.designation,
      status: user.status,
    });

    memoryStore.addAuditLog("USER_LOGIN", "User", user.id, `User logged in from web portal`, user.id);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        employeeId: user.employeeId,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
