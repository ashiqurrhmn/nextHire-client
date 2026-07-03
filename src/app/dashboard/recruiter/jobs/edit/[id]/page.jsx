import React from 'react';
import PostJobForm from '../../new/PostJobForm.jsx';
import { getLoggedInRecruiterCompany } from "@/lib/api/companies";
import { getJobById } from "@/lib/api/jobs";

const EditJobPage = async ({ params }) => {
  const { id } = await params;
  const company = await getLoggedInRecruiterCompany();
  const job = await getJobById(id);

  if (!job || job.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-zinc-400">
        <h2 className="text-2xl font-bold text-white mb-2">Job Not Found</h2>
        <p>The job you are trying to edit does not exist.</p>
      </div>
    );
  }

  return (
    <PostJobForm 
      company={company} 
      existingJob={job}
    />
  );
};

export default EditJobPage;
