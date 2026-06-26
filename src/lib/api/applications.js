import { serverFetch } from "../core/server";

export const getApplications = async(applicantId)=>{
    return serverFetch(`/api/applications?applicantId=${applicantId}`);
}

export const getCompanyApplications = async (companyId) => {
    return serverFetch(`/api/applications?companyId=${companyId}`);
};