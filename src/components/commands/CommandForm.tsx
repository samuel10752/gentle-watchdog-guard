import { useState } from 'react';
import { useCommands } from '@/hooks/useCommands';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

type CommandFormProps = {
  pcId: string;
};

const commandTypes = [
  { value: 'shell', label: 'Shell (CMD/PowerShell)' },
  { value: 'restart', label: 'Reiniciar PC' },
  { value: 'shutdown', label: 'Desligar PC' },
  { value: 'lock', label: 'Bloquear Sessão' },
  { value: 'message', label: 'Exibir Mensagem' },
];

export function CommandForm({ pcId }: CommandFormProps) {
  const [command, setCommand] = useState('');
  const [commandType, setCommandType] = useState('shell');
  const { sendCommand } = useCommands();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!command.trim()) {
      toast.error('Digite um comando');
      return;
    }

    try {
      await sendCommand.mutateAsync({ pcId, command, commandType });
      toast.success('Comando enviado!');
      setCommand('');
    } catch (error) {
      toast.error('Erro ao enviar comando');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Tipo de Comando</Label>
        <Select value={commandType} onValueChange={setCommandType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {commandTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Comando</Label>
        <Textarea
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder={
            commandType === 'shell'
              ? 'Ex: ipconfig /all'
              : commandType === 'message'
              ? 'Digite a mensagem a exibir'
              : 'Confirme o comando'
          }
          rows={3}
        />
      </div>

      <Button type="submit" disabled={sendCommand.isPending}>
        <Send className="mr-2 h-4 w-4" />
        {sendCommand.isPending ? 'Enviando...' : 'Enviar Comando'}
      </Button>
    </form>
  );
}
