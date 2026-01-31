import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PCList } from '@/components/pcs/PCList';
import { useManagedPCs } from '@/hooks/useManagedPCs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, MonitorCheck, MonitorX, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { pcs } = useManagedPCs();

  const stats = {
    total: pcs.length,
    online: pcs.filter(p => p.status === 'online').length,
    offline: pcs.filter(p => p.status === 'offline').length,
    pending: pcs.filter(p => p.status === 'pending_terms').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral dos PCs gerenciados
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de PCs</CardTitle>
              <Monitor className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Online</CardTitle>
              <MonitorCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.online}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Offline</CardTitle>
              <MonitorX className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-500">{stats.offline}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aguardando Termos</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">PCs Gerenciados</h2>
          <PCList />
        </div>
      </div>
    </DashboardLayout>
  );
}
