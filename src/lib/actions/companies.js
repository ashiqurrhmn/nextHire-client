'use server'

import { serverMutation } from "../core/server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const createCompany = async (newCompanyData) => {
    return serverMutation('/api/companies', newCompanyData);
}

export const getCompanies = async () => {
    const res = await fetch(`${baseUrl}/api/companies`);
    return res.json();
};