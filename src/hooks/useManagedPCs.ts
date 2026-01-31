import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ManagedPC } from '@/lib/supabase';
import { useEffect } from 'react';

export function useManagedPCs() {
  const queryClient = useQueryClient();

  const { data: pcs, isLoading, error } = useQuery({
    queryKey: ['managed-pcs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('managed_pcs')
        .select('*')
        .order('last_seen', { ascending: false });
      
      if (error) throw error;
      return data as ManagedPC[];
    },
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('managed_pcs_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'managed_pcs' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['managed-pcs'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { pcs: pcs ?? [], isLoading, error };
}

export function usePC(id: string) {
  return useQuery({
    queryKey: ['managed-pc', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('managed_pcs')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as ManagedPC | null;
    },
    enabled: !!id,
  });
}
