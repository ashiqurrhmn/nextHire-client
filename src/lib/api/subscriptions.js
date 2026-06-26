import { serverFetch } from "../core/server";

export const getAllSubscriptions = async () => {
    return serverFetch('/api/subscriptions');
};
