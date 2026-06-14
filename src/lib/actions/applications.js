'use server'

import { serverMutation, serverFetch } from "../core/server";

export const createApplication = async (newApplicationData) => {
    return serverMutation('/api/applications', newApplicationData);
}

export const checkApplication = async (jobId, applicantId) => {
    return serverFetch(`/api/applications/check?jobId=${jobId}&applicantId=${applicantId}`);
}

export const getMyAppliedJobIds = async (applicantId) => {
    return serverFetch(`/api/applications/my?applicantId=${applicantId}`);
}
