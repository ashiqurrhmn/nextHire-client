const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const serverFetch = async (path, data) => {
    const options = {
        method: 'GET',
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

    // Handle errors

    return res.json();
};