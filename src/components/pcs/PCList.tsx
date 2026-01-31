import { useManagedPCs } from '@/hooks/useManagedPCs';
import { PCCard } from './PCCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Monitor } from 'lucide-react';

export function PCList() {
  const { pcs, isLoading } = useManagedPCs();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

  if (pcs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Monitor className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">Nenhum PC registrado</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Configure o cliente RustDesk nos computadores que deseja gerenciar.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {pcs.map((pc) => (
        <PCCard key={pc.id} pc={pc} />
      ))}
    </div>
  );
}
