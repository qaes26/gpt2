export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    return new Response(
        JSON.stringify({
            url: process.env.SUPABASE_URL,
            key: process.env.SUPABASE_ANON_KEY
        }),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        }
    );
}
