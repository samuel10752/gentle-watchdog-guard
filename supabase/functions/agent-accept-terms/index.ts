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
    const { machine_id, terms_id, user_name, ip_address } = body;

    if (!machine_id || !terms_id) {
      return new Response(
        JSON.stringify({ error: 'machine_id e terms_id são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get PC by machine_id
    const { data: pc, error: pcError } = await supabase
      .from('managed_pcs')
      .select('id')
      .eq('machine_id', machine_id)
      .maybeSingle();

    if (pcError || !pc) {
      return new Response(
        JSON.stringify({ error: 'PC não encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const now = new Date().toISOString();

    // Update PC as terms accepted
    await supabase
      .from('managed_pcs')
      .update({
        terms_accepted: true,
        terms_accepted_at: now,
        status: 'online',
      })
      .eq('id', pc.id);

    // Log the acceptance
    await supabase.from('terms_acceptance_log').insert({
      pc_id: pc.id,
      terms_id,
      user_name,
      ip_address,
    });

    // Activity log
    await supabase.from('activity_logs').insert({
      pc_id: pc.id,
      action: 'terms_accepted',
      details: { terms_id, user_name },
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
