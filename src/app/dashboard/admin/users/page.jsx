import AdminUsersPage from './AdminUsersPage';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const AdminUsers = async () => {
  let users = [];
  try {
    const res = await fetch(`${baseUrl}/api/users`, { cache: 'no-store' });
    users = await res.json();
  } catch (err) {
    console.error("Failed to fetch users for admin:", err);
  }

  return <AdminUsersPage initialUsers={users} />;
};

export default AdminUsers;
