import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TermsOfUse } from '@/lib/supabase';

export function useTerms() {
  const queryClient = useQueryClient();

  const { data: terms, isLoading, error } = useQuery({
    queryKey: ['terms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('terms_of_use')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as TermsOfUse[];
    },
  });

  const activeTerms = terms?.find(t => t.is_active);

  const createTerms = useMutation({
    mutationFn: async ({ title, content, version }: { title: string; content: string; version: string }) => {
      // Deactivate all existing terms
      await supabase
        .from('terms_of_use')
        .update({ is_active: false })
        .eq('is_active', true);

      const { data, error } = await supabase
        .from('terms_of_use')
        .insert({
          title,
          content,
          version,
          is_active: true,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terms'] });
    },
  });

  return { terms: terms ?? [], activeTerms, isLoading, error, createTerms };
}
