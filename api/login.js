export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const { password } = await req.json();
        const correctPassword = process.env.ACCESS_PASSWORD;

        if (!correctPassword) {
            // If no password set in env, allow access (or block, depending on preference. Let's allow for now or default to a safe value)
            // Better to block if not configured to avoid accidents.
            return new Response(JSON.stringify({ error: 'Server configuration error' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (password === correctPassword) {
            return new Response(JSON.stringify({ authorized: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify({ authorized: false, error: 'Incorrect password' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Invalid request' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
