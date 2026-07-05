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

export const getAllJobs = async (status = "") => {
  let url = '/api/jobs';
  if (status && status !== "all") {
    url += `?status=${status}`;
  }
  return serverFetch(url);
};


export const getJobById = async (id) => {
  return serverFetch(`/api/jobs/${id}`);
};

export const trackJobView = async (jobId, companyId) => {
  const res = await fetch(`${baseUrl}/api/jobs/${jobId}/views`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ companyId }),
  });
  return res.json();
};

export const getCompanyJobViews = async (companyId) => {
  return serverFetch(`/api/job-views?companyId=${companyId}`);
};
