'use server'

import { serverMutation } from "../core/server";

export const createApplication = async (newApplicationData) => {
    return serverMutation('/api/applications', newApplicationData);
}
