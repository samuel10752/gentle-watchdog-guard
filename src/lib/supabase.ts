import { supabase } from "@/integrations/supabase/client";

export { supabase };

export type ManagedPC = {
  id: string;
  machine_id: string;
  hostname: string | null;
  cpu_info: string | null;
  ram_info: string | null;
  last_boot_time: string | null;
  last_seen: string | null;
  status: 'online' | 'offline' | 'pending_terms';
  terms_accepted: boolean | null;
  terms_accepted_at: string | null;
  ip_address: string | null;
  os_version: string | null;
  latitude: number | null;
  longitude: number | null;
  location_accuracy: number | null;
  location_updated_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PCCommand = {
  id: string;
  pc_id: string;
  command: string;
  command_type: string;
  status: 'pending' | 'sent' | 'executed' | 'failed';
  result: string | null;
  error_message: string | null;
  created_at: string;
  executed_at: string | null;
};

export type TermsOfUse = {
  id: string;
  title: string;
  content: string;
  version: string;
  is_active: boolean | null;
  created_at: string;
};

export type ActivityLog = {
  id: string;
  pc_id: string | null;
  action: string;
  details: Record<string, unknown> | null;
  created_at: string;
};
