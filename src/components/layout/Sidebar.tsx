import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Monitor,
  Terminal,
  FileText,
  Activity,
  Settings,
  LogOut,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/dashboard', icon: Monitor, label: 'PCs Gerenciados' },
  { to: '/commands', icon: Terminal, label: 'Comandos' },
  { to: '/terms', icon: FileText, label: 'Termos de Uso' },
  { to: '/logs', icon: Activity, label: 'Logs' },
  { to: '/docs', icon: BookOpen, label: 'Documentação' },
];

export function Sidebar() {
  const location = useLocation();
  const { signOut, user } = useAuth();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Monitor className="h-6 w-6 text-sidebar-primary" />
        <span className="text-lg font-semibold text-sidebar-foreground">
          PC Manager
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t p-4">
        <div className="mb-3 truncate text-sm text-sidebar-foreground/70">
          {user?.email}
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
