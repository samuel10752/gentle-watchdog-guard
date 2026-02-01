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
    const {
      machine_id,
      hostname,
      cpu_info,
      ram_info,
      last_boot_time,
      ip_address,
      os_version,
      latitude,
      longitude,
      location_accuracy,
    } = body;

    if (!machine_id) {
      return new Response(
        JSON.stringify({ error: 'machine_id é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if PC already exists
    const { data: existingPC } = await supabase
      .from('managed_pcs')
      .select('id, terms_accepted')
      .eq('machine_id', machine_id)
      .maybeSingle();

    let pcId: string;
    let needsTerms = false;

    if (existingPC) {
      // Update existing PC
      const updateData: Record<string, unknown> = {
        hostname,
        cpu_info,
        ram_info,
        last_boot_time,
        ip_address,
        os_version,
        last_seen: new Date().toISOString(),
        status: existingPC.terms_accepted ? 'online' : 'pending_terms',
      };

      // Add location data if provided
      if (latitude !== undefined && longitude !== undefined) {
        updateData.latitude = latitude;
        updateData.longitude = longitude;
        updateData.location_accuracy = location_accuracy;
        updateData.location_updated_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('managed_pcs')
        .update(updateData)
        .eq('id', existingPC.id)
        .select()
        .single();

      if (error) throw error;
      pcId = data.id;
      needsTerms = !existingPC.terms_accepted;
    } else {
      // Create new PC
      const insertData: Record<string, unknown> = {
        machine_id,
        hostname,
        cpu_info,
        ram_info,
        last_boot_time,
        ip_address,
        os_version,
        status: 'pending_terms',
      };

      // Add location data if provided
      if (latitude !== undefined && longitude !== undefined) {
        insertData.latitude = latitude;
        insertData.longitude = longitude;
        insertData.location_accuracy = location_accuracy;
        insertData.location_updated_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('managed_pcs')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      pcId = data.id;
      needsTerms = true;
    }

    // Log the registration
    await supabase.from('activity_logs').insert({
      pc_id: pcId,
      action: existingPC ? 'heartbeat' : 'register',
      details: { hostname, ip_address },
    });

    return new Response(
      JSON.stringify({
        success: true,
        pc_id: pcId,
        needs_terms: needsTerms,
      }),
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
