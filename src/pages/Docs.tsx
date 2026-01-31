import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Code, Download, Settings, Terminal } from 'lucide-react';

export default function Docs() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Documentação</h1>
          <p className="text-muted-foreground">
            Guia de integração com o cliente Windows (RustDesk Fork)
          </p>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="setup">Configuração</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="commands">Comandos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Arquitetura do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <p>
                  O sistema é composto por dois componentes principais:
                </p>
                <ul>
                  <li>
                    <strong>Painel Web (este sistema)</strong>: Dashboard para gerenciar PCs, 
                    enviar comandos e configurar termos de uso.
                  </li>
                  <li>
                    <strong>Agente Windows (RustDesk Fork)</strong>: Cliente que roda nos PCs 
                    gerenciados, coleta informações e executa comandos.
                  </li>
                </ul>

                <h3>Fluxo de Comunicação</h3>
                <ol>
                  <li>O agente Windows registra o PC na API ao iniciar</li>
                  <li>Periodicamente envia heartbeat com informações do sistema</li>
                  <li>Busca comandos pendentes e os executa</li>
                  <li>Exibe tela de termos se necessário (antes de liberar acesso)</li>
                </ol>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="setup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Configurando o Fork do RustDesk
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <h3>1. Clone o repositório</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{`git clone https://github.com/rustdesk/rustdesk.git
cd rustdesk`}</code>
                </pre>

                <h3>2. Configure as variáveis de ambiente</h3>
                <p>Crie um arquivo <code>.env</code> com:</p>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{`API_URL=https://mpqmrijuczjyqmxlbvyk.supabase.co/functions/v1
API_KEY=<sua_api_key>`}</code>
                </pre>

                <h3>3. Modifique o código fonte</h3>
                <p>
                  Você precisará adicionar módulos personalizados para:
                </p>
                <ul>
                  <li>Coleta de informações de hardware (WMI no Windows)</li>
                  <li>Comunicação com a API REST</li>
                  <li>Exibição da tela de termos de uso</li>
                  <li>Polling de comandos pendentes</li>
                </ul>

                <h3>4. Compile o projeto</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{`cargo build --release`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Instalação no Windows
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <p>Para que o agente inicie automaticamente com o Windows:</p>

                <h3>1. Crie um serviço Windows</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{`sc create PCManagerAgent binPath="C:\\Program Files\\PCManager\\agent.exe" start=auto`}</code>
                </pre>

                <h3>2. Ou adicione ao Registro</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{`reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run" /v PCManagerAgent /t REG_SZ /d "C:\\Program Files\\PCManager\\agent.exe"`}</code>
                </pre>

                <h3>3. Configure a tela de termos</h3>
                <p>
                  A tela de termos deve ser exibida usando a API do Windows para 
                  criar uma janela que bloqueie a área de trabalho até o aceite.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Endpoints da API
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-500">POST</Badge>
                    <code className="text-sm">/agent-register</code>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Registra um novo PC ou atualiza informações existentes.
                  </p>
                  <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                    <code>{`{
  "machine_id": "string (único por PC)",
  "hostname": "DESKTOP-ABC123",
  "cpu_info": "Intel Core i7-10700K",
  "ram_info": "16 GB",
  "last_boot_time": "2024-01-15T08:30:00Z",
  "ip_address": "192.168.1.100",
  "os_version": "Windows 10 Pro"
}`}</code>
                  </pre>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-500">GET</Badge>
                    <code className="text-sm">/agent-commands?machine_id=xxx</code>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Busca comandos pendentes para o PC.
                  </p>
                  <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                    <code>{`// Resposta
{
  "commands": [
    {
      "id": "uuid",
      "command": "ipconfig /all",
      "command_type": "shell"
    }
  ]
}`}</code>
                  </pre>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-yellow-500">PUT</Badge>
                    <code className="text-sm">/agent-command-result</code>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Envia o resultado da execução de um comando.
                  </p>
                  <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                    <code>{`{
  "command_id": "uuid",
  "status": "executed | failed",
  "result": "output do comando",
  "error_message": "mensagem de erro (se falhou)"
}`}</code>
                  </pre>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-500">GET</Badge>
                    <code className="text-sm">/agent-terms</code>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Obtém os termos de uso ativos.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-500">POST</Badge>
                    <code className="text-sm">/agent-accept-terms</code>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Registra o aceite dos termos pelo usuário.
                  </p>
                  <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                    <code>{`{
  "machine_id": "string",
  "terms_id": "uuid",
  "user_name": "Nome do Usuário Windows"
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commands" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  Tipos de Comandos Suportados
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Descrição</th>
                      <th>Exemplo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>shell</code></td>
                      <td>Executa comando no CMD/PowerShell</td>
                      <td><code>ipconfig /all</code></td>
                    </tr>
                    <tr>
                      <td><code>restart</code></td>
                      <td>Reinicia o computador</td>
                      <td><code>Reiniciar em 60 segundos</code></td>
                    </tr>
                    <tr>
                      <td><code>shutdown</code></td>
                      <td>Desliga o computador</td>
                      <td><code>Desligar em 60 segundos</code></td>
                    </tr>
                    <tr>
                      <td><code>lock</code></td>
                      <td>Bloqueia a sessão do usuário</td>
                      <td><code>-</code></td>
                    </tr>
                    <tr>
                      <td><code>message</code></td>
                      <td>Exibe mensagem na tela</td>
                      <td><code>Atenção: Manutenção em 5 min</code></td>
                    </tr>
                  </tbody>
                </table>

                <h3>Implementação no Agente</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{`match command.command_type.as_str() {
    "shell" => {
        let output = Command::new("cmd")
            .args(["/C", &command.command])
            .output()?;
        String::from_utf8_lossy(&output.stdout).to_string()
    }
    "restart" => {
        Command::new("shutdown")
            .args(["/r", "/t", "60"])
            .spawn()?;
        "Reinício agendado".to_string()
    }
    "shutdown" => {
        Command::new("shutdown")
            .args(["/s", "/t", "60"])
            .spawn()?;
        "Desligamento agendado".to_string()
    }
    "lock" => {
        Command::new("rundll32.exe")
            .args(["user32.dll,LockWorkStation"])
            .spawn()?;
        "Sessão bloqueada".to_string()
    }
    "message" => {
        // Exibir MessageBox com Windows API
        show_message_box(&command.command)?;
        "Mensagem exibida".to_string()
    }
    _ => "Tipo de comando desconhecido".to_string()
}`}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
