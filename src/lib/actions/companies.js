'use server'

import { serverMutation } from "../core/server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const createCompany = async (newCompanyData) => {
    return serverMutation('/api/companies', newCompanyData);
}

export const getCompanies = async (recruiterId) => {
    const url = recruiterId 
        ? `${baseUrl}/api/companies?recruiterId=${recruiterId}`
        : `${baseUrl}/api/companies`;
    const res = await fetch(url);
    return res.json();
};