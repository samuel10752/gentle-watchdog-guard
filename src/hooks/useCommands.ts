import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PCCommand } from '@/lib/supabase';
import { useEffect } from 'react';

export function useCommands(pcId?: string) {
  const queryClient = useQueryClient();

  const { data: commands, isLoading, error } = useQuery({
    queryKey: ['commands', pcId],
    queryFn: async () => {
      let query = supabase
        .from('pc_commands')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (pcId) {
        query = query.eq('pc_id', pcId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as PCCommand[];
    },
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('commands_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pc_commands' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['commands'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const sendCommand = useMutation({
    mutationFn: async ({ pcId, command, commandType = 'shell' }: { pcId: string; command: string; commandType?: string }) => {
      const { data, error } = await supabase
        .from('pc_commands')
        .insert({
          pc_id: pcId,
          command,
          command_type: commandType,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commands'] });
    },
  });

  return { commands: commands ?? [], isLoading, error, sendCommand };
}
