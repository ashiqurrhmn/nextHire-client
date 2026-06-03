import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// In-memory mock jobs store
if (!global.mockJobsStore) {
  global.mockJobsStore = [];
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

    // Verify company in memory
    const company = global.mockCompanyStore;
    if (!company) {
      return NextResponse.json({ error: "Recruiter does not have a registered company." }, { status: 400 });
    }

    const body = await request.json();
    const {
      title,
      category,
      type,
      salaryMin,
      salaryMax,
      currency,
      isRemote,
      location, // { city, country }
      deadline,
      responsibilities,
      requirements,
      benefits,
    } = body;

    // Validate inputs
    if (!title || !category || !type || !currency || !deadline || !responsibilities || !requirements) {
      return NextResponse.json({ error: "Required fields are missing." }, { status: 400 });
    }

    if (salaryMin !== undefined && salaryMax !== undefined && salaryMin !== "" && salaryMax !== "" && Number(salaryMin) > Number(salaryMax)) {
      return NextResponse.json({ error: "Minimum salary cannot be greater than maximum salary." }, { status: 400 });
    }

    if (!isRemote && (!location || !location.city || !location.country)) {
      return NextResponse.json({ error: "Location (City and Country) is required for non-remote jobs." }, { status: 400 });
    }

    const jobData = {
      _id: "mock_job_id_" + Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      category: category.trim(),
      type, // Full-time / Part-time / Remote / Contract / Internship
      salaryMin: salaryMin ? Number(salaryMin) : null,
      salaryMax: salaryMax ? Number(salaryMax) : null,
      currency,
      isRemote: Boolean(isRemote),
      location: isRemote ? null : {
        city: location.city.trim(),
        country: location.country.trim(),
      },
      deadline: new Date(deadline),
      responsibilities: responsibilities.trim(),
      requirements: requirements.trim(),
      benefits: benefits ? benefits.trim() : "",
      companyId: company._id,
      companyName: company.name,
      companyCategory: company.category,
      companyLogoColor: company.logoColor,
      companyLetter: company.letter,
      recruiterId: user.id,
      status: "active",
      visibility: "public",
      createdAt: new Date(),
    };

    global.mockJobsStore.push(jobData);
    
    return NextResponse.json({
      success: true,
      job: jobData
    }, { status: 201 });

  } catch (error) {
    console.error("Error in POST /api/jobs:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
