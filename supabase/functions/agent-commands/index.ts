import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const url = new URL(req.url);
    const machineId = url.searchParams.get('machine_id');

    if (!machineId) {
      return new Response(
        JSON.stringify({ error: 'machine_id é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get PC by machine_id
    const { data: pc, error: pcError } = await supabase
      .from('managed_pcs')
      .select('id')
      .eq('machine_id', machineId)
      .maybeSingle();

    if (pcError || !pc) {
      return new Response(
        JSON.stringify({ error: 'PC não encontrado', commands: [] }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get pending commands
    const { data: commands, error } = await supabase
      .from('pc_commands')
      .select('id, command, command_type')
      .eq('pc_id', pc.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Mark commands as sent
    if (commands && commands.length > 0) {
      const commandIds = commands.map(c => c.id);
      await supabase
        .from('pc_commands')
        .update({ status: 'sent' })
        .in('id', commandIds);
    }

    return new Response(
      JSON.stringify({ commands: commands || [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
