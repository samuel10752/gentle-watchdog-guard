import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useActivityLogs } from '@/hooks/useActivityLogs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Logs() {
  const { logs, isLoading } = useActivityLogs();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-96" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Logs de Atividade</h1>
          <p className="text-muted-foreground">
            Histórico de todas as ações do sistema
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <div className="py-12 text-center">
                <Activity className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">Nenhuma atividade registrada</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  As atividades aparecerão aqui quando os PCs começarem a se comunicar.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-4 rounded-lg border p-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{log.action}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(log.created_at), "dd/MM/yyyy 'às' HH:mm:ss", {
                              locale: ptBR,
                            })}
                          </span>
                        </div>
                        {log.details && (
                          <pre className="mt-2 text-xs text-muted-foreground overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
