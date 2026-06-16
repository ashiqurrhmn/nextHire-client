const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const serverFetch = async (path, data) => {
    const options = {
        method: 'GET',
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    if (data !== undefined) {
        options.body = JSON.stringify(data);
    }
    const res = await fetch(`${baseUrl}${path}`, options);
    return res.json();
};

export const serverMutation = async (path, data) => {
    const res = await fetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const json = await res.json();

    // Handle non-OK responses by returning the error
    if (!res.ok) {
        return { error: json.error || `Request failed with status ${res.status}` };
    }

    return json;
};