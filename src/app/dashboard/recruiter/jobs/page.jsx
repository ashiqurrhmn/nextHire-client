import React from 'react';
import RecruiterJobsPage from './RecruiterJobsPage.jsx';
import { getLoggedInRecruiterCompany } from "@/lib/api/companies";
import { getCompanyJobs } from "@/lib/api/jobs";

const RecruiterJobs = async () => {
  const company = await getLoggedInRecruiterCompany();
  const companyId = company?.id || company?._id;
  const initialJobs = companyId ? await getCompanyJobs(companyId) : [];

  return (
    <RecruiterJobsPage 
      company={company} 
      initialJobs={initialJobs} 
    />
  );
};

export default RecruiterJobs;