import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// In-memory mock company store
if (!global.mockCompanyStore) {
  global.mockCompanyStore = null;
}

export async function GET(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = session.user;
    if (user.role !== "recruiter") {
      return NextResponse.json({ error: "Forbidden: Not a recruiter" }, { status: 403 });
    }

    return NextResponse.json({ company: global.mockCompanyStore });
  } catch (error) {
    console.error("Error in GET /api/recruiter/company:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = session.user;
    if (user.role !== "recruiter") {
      return NextResponse.json({ error: "Forbidden: Not a recruiter" }, { status: 403 });
    }

    const body = await request.json();
    const { name, category } = body;

    if (!name || !category) {
      return NextResponse.json({ error: "Name and Category are required" }, { status: 400 });
    }

    // Set up standard beautiful company details
    const logoColors = [
      "bg-blue-600/10 text-blue-400 border-blue-900/30",
      "bg-purple-600/10 text-purple-400 border-purple-900/30",
      "bg-red-600/10 text-red-500 border-red-900/30",
      "bg-emerald-600/10 text-emerald-400 border-emerald-900/30",
      "bg-amber-600/10 text-amber-400 border-amber-900/30",
    ];
    const randomColor = logoColors[Math.floor(Math.random() * logoColors.length)];
    const letter = name.charAt(0).toUpperCase();

    const companyData = {
      _id: "mock_company_id_" + Math.random().toString(36).substr(2, 9),
      name,
      category,
      logoColor: randomColor,
      letter,
      recruiterId: user.id,
      status: "approved",
      createdAt: new Date(),
    };

    global.mockCompanyStore = companyData;

    return NextResponse.json({ company: companyData }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/recruiter/company:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
