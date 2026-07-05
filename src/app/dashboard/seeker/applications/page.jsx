import { getUserSession } from "@/lib/core/session";
import { getApplications } from "@/lib/api/applications";
import { getAllJobs } from "@/lib/api/jobs";
import ApplicationsClient from "./ApplicationsClient";

const colors = [
  "#635BFF", "#A259FF", "#10A37F", "#FF6B6B", "#5E6AD2", "#0088FF"
];

export const metadata = {
  title: "My Applications - NextHire",
};

export default async function SeekerApplicationsPage() {
  const user = await getUserSession();
  
  // If no user, it would have been redirected by the layout's requireRole("seeker"), 
  // but let's be safe.
  if (!user) return null;

  // Fetch applications for this user
  const applications = await getApplications(user.id) || [];
  
  // Fetch all jobs to get company logos and colors
  let jobs = [];
  try {
    jobs = await getAllJobs() || [];
  } catch (error) {
    console.error("Failed to fetch jobs for applications:", error);
  }

  // Create a map for quick job lookup
  const jobMap = new Map();
  jobs.forEach((job, index) => {
    // Add default color logic from Browse Jobs to keep consistency
    jobMap.set(job._id || job.id, {
      ...job,
      companyColor: colors[index % colors.length]
    });
  });

  // Attach job info to applications
  const enrichedApplications = applications.map(app => {
    const job = jobMap.get(app.jobId);
    if (job) {
      return {
        ...app,
        companyLogo: job.companyLogo || job.logo,
        companyColor: job.companyColor,
      };
    }
    return app;
  });

  return <ApplicationsClient applications={enrichedApplications} />;
}