import AdminJobsPage from './AdminJobsPage';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const AdminJobs = async () => {
  let jobs = [];
  try {
    const res = await fetch(`${baseUrl}/api/jobs`, { cache: 'no-store' });
    jobs = await res.json();
  } catch (err) {
    console.error("Failed to fetch jobs for admin:", err);
  }

  return <AdminJobsPage initialJobs={jobs} />;
};

export default AdminJobs;
