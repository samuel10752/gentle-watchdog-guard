import { useCommands } from '@/hooks/useCommands';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Terminal, CheckCircle, XCircle, Clock, Send } from 'lucide-react';

type CommandHistoryProps = {
  pcId?: string;
};

const statusConfig = {
  pending: { icon: Clock, color: 'bg-yellow-500', label: 'Pendente' },
  sent: { icon: Send, color: 'bg-blue-500', label: 'Enviado' },
  executed: { icon: CheckCircle, color: 'bg-green-500', label: 'Executado' },
  failed: { icon: XCircle, color: 'bg-red-500', label: 'Falhou' },
};

export function CommandHistory({ pcId }: CommandHistoryProps) {
  const { commands, isLoading } = useCommands(pcId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  if (commands.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Terminal className="h-8 w-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">
          Nenhum comando enviado ainda
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-3">
        {commands.map((cmd) => {
          const status = statusConfig[cmd.status];
          const StatusIcon = status.icon;
          
          return (
            <Card key={cmd.id}>
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {cmd.command_type}
                    </Badge>
                    <Badge className={`${status.color} text-white border-none`}>
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {status.label}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(cmd.created_at), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="py-2">
                <pre className="rounded bg-muted p-2 text-xs overflow-x-auto">
                  {cmd.command}
                </pre>
                {cmd.result && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Resultado:
                    </p>
                    <pre className="rounded bg-green-50 dark:bg-green-950 p-2 text-xs overflow-x-auto">
                      {cmd.result}
                    </pre>
                  </div>
                )}
                {cmd.error_message && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-destructive mb-1">
                      Erro:
                    </p>
                    <pre className="rounded bg-red-50 dark:bg-red-950 p-2 text-xs overflow-x-auto">
                      {cmd.error_message}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}
