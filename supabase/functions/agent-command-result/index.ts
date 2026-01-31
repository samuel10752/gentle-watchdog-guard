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

    const body = await req.json();
    const { command_id, status, result, error_message } = body;

    if (!command_id || !status) {
      return new Response(
        JSON.stringify({ error: 'command_id e status são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update command status
    const { data, error } = await supabase
      .from('pc_commands')
      .update({
        status,
        result,
        error_message,
        executed_at: new Date().toISOString(),
      })
      .eq('id', command_id)
      .select('pc_id, command, command_type')
      .single();

    if (error) throw error;

    // Log the execution
    await supabase.from('activity_logs').insert({
      pc_id: data.pc_id,
      action: 'command_executed',
      details: {
        command_id,
        command_type: data.command_type,
        status,
        has_error: !!error_message,
      },
    });

    return new Response(
      JSON.stringify({ success: true }),
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
