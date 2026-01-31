import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CommandForm } from '@/components/commands/CommandForm';
import { CommandHistory } from '@/components/commands/CommandHistory';
import { usePC } from '@/hooks/useManagedPCs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Monitor, Cpu, HardDrive, Clock, Wifi, Calendar } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-500',
  pending_terms: 'bg-yellow-500',
};

const statusLabels = {
  online: 'Online',
  offline: 'Offline',
  pending_terms: 'Aguardando Termos',
};

export default function PCDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: pc, isLoading } = usePC(id!);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-48" />
        </div>
      </DashboardLayout>
    );
  }

  if (!pc) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">PC não encontrado</h2>
          <Button asChild className="mt-4">
            <Link to="/dashboard">Voltar ao Dashboard</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Monitor className="h-6 w-6" />
              <h1 className="text-2xl font-bold">{pc.hostname || pc.machine_id}</h1>
              <Badge className={`${statusColors[pc.status]} text-white border-none`}>
                {statusLabels[pc.status]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              ID: {pc.machine_id}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Cpu className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Processador</p>
                    <p className="text-sm text-muted-foreground">{pc.cpu_info || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <HardDrive className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Memória RAM</p>
                    <p className="text-sm text-muted-foreground">{pc.ram_info || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Wifi className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Endereço IP</p>
                    <p className="text-sm text-muted-foreground">{pc.ip_address || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Monitor className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Sistema Operacional</p>
                    <p className="text-sm text-muted-foreground">{pc.os_version || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Última Inicialização</p>
                    <p className="text-sm text-muted-foreground">
                      {pc.last_boot_time
                        ? formatDistanceToNow(new Date(pc.last_boot_time), { addSuffix: true, locale: ptBR })
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Registrado em</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(pc.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              </div>

              {pc.terms_accepted && pc.terms_accepted_at && (
                <div className="pt-4 border-t">
                  <p className="text-sm">
                    <span className="font-medium">Termos aceitos em:</span>{' '}
                    {format(new Date(pc.terms_accepted_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enviar Comando</CardTitle>
            </CardHeader>
            <CardContent>
              <CommandForm pcId={pc.id} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Comandos</CardTitle>
          </CardHeader>
          <CardContent>
            <CommandHistory pcId={pc.id} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
