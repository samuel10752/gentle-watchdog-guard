-- Enum para status do PC
CREATE TYPE public.pc_status AS ENUM ('online', 'offline', 'pending_terms');

-- Enum para status do comando
CREATE TYPE public.command_status AS ENUM ('pending', 'sent', 'executed', 'failed');

-- Tabela de PCs gerenciados
CREATE TABLE public.managed_pcs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  machine_id TEXT NOT NULL UNIQUE,
  hostname TEXT,
  cpu_info TEXT,
  ram_info TEXT,
  last_boot_time TIMESTAMP WITH TIME ZONE,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status public.pc_status DEFAULT 'offline',
  terms_accepted BOOLEAN DEFAULT false,
  terms_accepted_at TIMESTAMP WITH TIME ZONE,
  ip_address TEXT,
  os_version TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de comandos para enviar aos PCs
CREATE TABLE public.pc_commands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pc_id UUID REFERENCES public.managed_pcs(id) ON DELETE CASCADE NOT NULL,
  command TEXT NOT NULL,
  command_type TEXT NOT NULL DEFAULT 'shell',
  status public.command_status DEFAULT 'pending',
  result TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  executed_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de termos de uso
CREATE TABLE public.terms_of_use (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  version TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de aceite dos termos
CREATE TABLE public.terms_acceptance_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pc_id UUID REFERENCES public.managed_pcs(id) ON DELETE CASCADE NOT NULL,
  terms_id UUID REFERENCES public.terms_of_use(id) ON DELETE CASCADE NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_name TEXT,
  ip_address TEXT
);

-- Tabela de logs de atividade
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pc_id UUID REFERENCES public.managed_pcs(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de roles de administradores
CREATE TYPE public.app_role AS ENUM ('admin', 'viewer');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'viewer',
  UNIQUE(user_id, role)
);

-- Tabela de perfis
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Função para verificar role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para criar perfil
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger para updated_at em managed_pcs
CREATE TRIGGER update_managed_pcs_updated_at
  BEFORE UPDATE ON public.managed_pcs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS
ALTER TABLE public.managed_pcs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pc_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terms_of_use ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terms_acceptance_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para managed_pcs (apenas admins)
CREATE POLICY "Admins can manage PCs" ON public.managed_pcs
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Políticas RLS para pc_commands (apenas admins)
CREATE POLICY "Admins can manage commands" ON public.pc_commands
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Políticas RLS para terms_of_use (admins gerenciam, todos podem ver ativos)
CREATE POLICY "Admins can manage terms" ON public.terms_of_use
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active terms" ON public.terms_of_use
  FOR SELECT USING (is_active = true);

-- Políticas RLS para terms_acceptance_log
CREATE POLICY "Admins can view acceptance logs" ON public.terms_acceptance_log
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Políticas RLS para activity_logs
CREATE POLICY "Admins can view logs" ON public.activity_logs
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Políticas RLS para user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Políticas RLS para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Habilitar realtime para tabelas importantes
ALTER PUBLICATION supabase_realtime ADD TABLE public.managed_pcs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pc_commands;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;