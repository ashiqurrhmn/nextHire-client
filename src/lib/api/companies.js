import { serverFetch } from "../core/server";
import { getUserSession } from "../core/session";

export const getCompanyByUser = async (userId) => {
  return serverFetch(`/api/my/companies?recruiterId=${userId}`);
};

export const getLoggedInRecruiterCompany = async () => {
  const user = await getUserSession();
  if (!user || !user.id) return null;
  const companies = await getCompanyByUser(user.id);
  if (Array.isArray(companies) && companies.length > 0) {
    return companies[0];
  }
  return null;
};
