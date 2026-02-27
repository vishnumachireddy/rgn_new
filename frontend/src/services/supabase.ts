import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Real-time helper
export const subscribeToOrders = (farmerId: string, callback: (payload: any) => void) => {
    return supabase
        .channel('orders')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'orders',
                filter: `farmer_id=eq.${farmerId}`,
            },
            callback
        )
        .subscribe();
};
