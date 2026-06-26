import React from "react";
import RecruiterApplicationsPage from "./RecruiterApplicationsPage";
import { getLoggedInRecruiterCompany } from "@/lib/api/companies";
import { getCompanyApplications } from "@/lib/api/applications";

const RecruiterApplications = async () => {
  const company = await getLoggedInRecruiterCompany();
  let initialApplications = [];

  if (company?._id) {
    try {
      const data = await getCompanyApplications(company._id);
      if (Array.isArray(data)) {
        initialApplications = data;
      }
    } catch (err) {
      console.warn("Failed to fetch applications:", err);
    }
  }

  return (
    <RecruiterApplicationsPage
      company={company}
      initialApplications={initialApplications}
    />
  );
};

export default RecruiterApplications;
