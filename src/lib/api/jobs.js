import { serverFetch } from "../core/server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getCompanyJobs = async (companyId, status = "") => {
  let url = `${baseUrl}/api/jobs?companyId=${companyId}`;
  if (status && status !== "all") {
    url += `&status=${status}`;
  }
  const res = await fetch(url);
  return res.json();
};

export const getAllJobs = async () => {
  return serverFetch('/api/jobs');
};


export const getJobById = async (id) => {
  return serverFetch(`/api/jobs/${id}`);
};
