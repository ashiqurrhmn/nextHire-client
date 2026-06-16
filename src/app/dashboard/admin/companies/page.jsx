import AdminCompaniesPage from './AdminCompaniesPage';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const AdminCompanies = async () => {
  let companies = [];
  try {
    const res = await fetch(`${baseUrl}/api/companies`, { cache: 'no-store' });
    companies = await res.json();
  } catch (err) {
    console.error("Failed to fetch companies for admin:", err);
  }

  return <AdminCompaniesPage initialCompanies={companies} />;
};

export default AdminCompanies;
