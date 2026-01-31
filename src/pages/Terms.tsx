import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useTerms } from '@/hooks/useTerms';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Plus, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Terms() {
  const { terms, activeTerms, isLoading, createTerms } = useTerms();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [version, setVersion] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !version) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      await createTerms.mutateAsync({ title, content, version });
      toast.success('Termos criados com sucesso!');
      setOpen(false);
      setTitle('');
      setContent('');
      setVersion('');
    } catch (error) {
      toast.error('Erro ao criar termos');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Termos de Uso</h1>
            <p className="text-muted-foreground">
              Gerencie os termos que os usuários devem aceitar
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Termo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Novo Termo de Uso</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Termos de Uso do Sistema"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Versão</Label>
                    <Input
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      placeholder="Ex: 1.0.0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Conteúdo</Label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Digite o conteúdo completo dos termos de uso..."
                    rows={10}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createTerms.isPending}>
                    {createTerms.isPending ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {activeTerms && (
          <Card className="border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {activeTerms.title}
                </CardTitle>
                <Badge className="bg-green-500 text-white">Ativo</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Versão {activeTerms.version} • Criado em{' '}
                {format(new Date(activeTerms.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
                  {activeTerms.content}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {terms.filter(t => !t.is_active).length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Versões Anteriores</h2>
            {terms
              .filter((t) => !t.is_active)
              .map((term) => (
                <Card key={term.id} className="opacity-70">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{term.title}</CardTitle>
                      <Badge variant="outline">Inativo</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Versão {term.version} • Criado em{' '}
                      {format(new Date(term.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </CardHeader>
                </Card>
              ))}
          </div>
        )}

        {terms.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Nenhum termo criado</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Crie um termo de uso para que os usuários aceitem ao iniciar o PC.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
