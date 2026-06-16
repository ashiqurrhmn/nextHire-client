import { serverFetch } from "../core/server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export const toggleSaveJob = async (userId, jobId) => {
  const res = await fetch(`${baseUrl}/api/saved-jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, jobId }),
  });
  return res.json();
};

export const getSavedJobs = async (userId) => {
  return serverFetch(`/api/saved-jobs?userId=${userId}`);
};

export const getSavedJobIds = async (userId) => {
  return serverFetch(`/api/saved-jobs/ids?userId=${userId}`);
};
