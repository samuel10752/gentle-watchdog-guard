import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CommandHistory } from '@/components/commands/CommandHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Commands() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Comandos</h1>
          <p className="text-muted-foreground">
            Histórico de todos os comandos enviados
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todos os Comandos</CardTitle>
          </CardHeader>
          <CardContent>
            <CommandHistory />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
