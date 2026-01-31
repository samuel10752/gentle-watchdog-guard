import { ManagedPC } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Monitor, Cpu, HardDrive, Clock, Wifi, Terminal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';

type PCCardProps = {
  pc: ManagedPC;
};

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

export function PCCard({ pc }: PCCardProps) {
  const lastSeen = pc.last_seen
    ? formatDistanceToNow(new Date(pc.last_seen), { addSuffix: true, locale: ptBR })
    : 'Nunca';

  const lastBoot = pc.last_boot_time
    ? formatDistanceToNow(new Date(pc.last_boot_time), { addSuffix: true, locale: ptBR })
    : 'Desconhecido';

  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Monitor className="h-5 w-5" />
          {pc.hostname || pc.machine_id}
        </CardTitle>
        <Badge
          variant="outline"
          className={`${statusColors[pc.status]} text-white border-none`}
        >
          {statusLabels[pc.status]}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Cpu className="h-4 w-4" />
            <span className="truncate">{pc.cpu_info || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <HardDrive className="h-4 w-4" />
            <span>{pc.ram_info || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Boot: {lastBoot}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wifi className="h-4 w-4" />
            <span>{pc.ip_address || 'N/A'}</span>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Última atividade: {lastSeen}
        </div>

        <div className="flex gap-2 pt-2">
          <Button asChild size="sm" className="flex-1">
            <Link to={`/pc/${pc.id}`}>
              <Terminal className="mr-2 h-4 w-4" />
              Gerenciar
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
