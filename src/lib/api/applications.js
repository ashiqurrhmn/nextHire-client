import { serverFetch } from "../core/server";

export const getApplications = async(applicantId)=>{
    return serverFetch(`/api/applications?applicantId=${applicantId}`);
}