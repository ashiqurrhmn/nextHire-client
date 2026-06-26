import AdminPaymentsPage from "./AdminPaymentsPage";
import { MongoClient } from "mongodb";

const getDbSubscriptions = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db(process.env.AUTH_DB_NAME);
    const subscriptions = await db.collection("subscriptions").find({}).toArray();
    
    // Convert ObjectId and Date to string so it can be passed to Client Component
    return subscriptions.map(sub => ({
      ...sub,
      _id: sub._id.toString(),
      createdAt: sub.createdAt ? new Date(sub.createdAt).toISOString() : null,
      updatedAt: sub.updatedAt ? new Date(sub.updatedAt).toISOString() : null,
    }));
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    return [];
  }
};

const AdminPayments = async () => {
  let initialPayments = [];

  try {
    const data = await getDbSubscriptions();
    if (Array.isArray(data)) {
      initialPayments = data;
    }
  } catch (err) {
    console.warn("Failed to fetch all subscriptions:", err);
  }

  return <AdminPaymentsPage initialPayments={initialPayments} />;
};

export default AdminPayments;
