import { createClient } from '@supabase/supabase-js';

export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    if (req.method !== 'GET') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return new Response(JSON.stringify({ error: 'Supabase credentials missing' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true }) // Oldest first
            .limit(50);

        if (error) throw error;

        return new Response(JSON.stringify({ messages: data }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Supabase Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
