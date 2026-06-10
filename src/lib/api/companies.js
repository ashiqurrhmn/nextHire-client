import { serverFetch } from "../core/server";


export const getCompanyByUser = async (userId) => {
    return serverFetch(`/api/my/companies?recruiterId=${userId}`);
};