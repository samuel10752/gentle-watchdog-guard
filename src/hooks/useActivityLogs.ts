import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ActivityLog } from '@/lib/supabase';
import { useEffect } from 'react';

export function useActivityLogs(pcId?: string) {
  const queryClient = useQueryClient();

  const { data: logs, isLoading, error } = useQuery({
    queryKey: ['activity-logs', pcId],
    queryFn: async () => {
      let query = supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (pcId) {
        query = query.eq('pc_id', pcId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as ActivityLog[];
    },
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('activity_logs_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activity_logs' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { logs: logs ?? [], isLoading, error };
}
