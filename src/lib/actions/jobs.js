'use server'

import { serverMutation } from "../core/server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const createJob = async (newJobData) => {
    return serverMutation('/api/jobs', newJobData);
}

export const updateJob = async (jobId, jobData) => {
    const res = await fetch(`${baseUrl}/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
    });
    const json = await res.json();
    if (!res.ok) {
        return { error: json.error || `Request failed with status ${res.status}` };
    }
    return json;
}
