'use client';

import { useState } from 'react';
import {
  BarChart3,
  FileJson,
  Settings,
  Home,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  TrendingUp,
  Database,
  Lightbulb,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  submenu?: MenuItem[];
}

interface SidebarProps {
  onNavigate: (menu: string, submenu?: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ onNavigate, isOpen, onToggle }: SidebarProps) {
  const [expandedMenu, setExpandedMenu] = useState<string>('');

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      submenu: [
        { id: 'overview', label: 'Overview' },
        { id: 'analytics', label: 'Analytics' },
      ],
    },
    {
      id: 'features',
      label: 'Features',
      icon: <Zap className="w-5 h-5" />,
      submenu: [
        { id: 'query-engine', label: '1. Conversational Query' },
        { id: 'dashboard-gen', label: '2. Dashboard Generator' },
        { id: 'chart-selector', label: '3. AI Chart Selection' },
        { id: 'kpi-engine', label: '4. KPI Metrics' },
        { id: 'charts', label: '5. Interactive Charts' },
        { id: 'insights', label: '6. AI Insights' },
        { id: 'followup', label: '7. Follow-up Queries' },
        { id: 'csv-upload', label: '8. CSV Upload' },
      ],
    },
    {
      id: 'bonus',
      label: 'Bonus Features',
      icon: <Lightbulb className="w-5 h-5" />,
      submenu: [
        { id: 'voice-query', label: 'Voice Query' },
        { id: 'storytelling', label: 'AI Storytelling' },
      ],
    },
    {
      id: 'data',
      label: 'Data Management',
      icon: <Database className="w-5 h-5" />,
      submenu: [
        { id: 'upload', label: 'Upload CSV' },
        { id: 'schema', label: 'View Schema' },
        { id: 'tables', label: 'Manage Tables' },
      ],
    },
    {
      id: 'analytics',
      label: 'Queries & Insights',
      icon: <TrendingUp className="w-5 h-5" />,
      submenu: [
        { id: 'history', label: 'Query History' },
        { id: 'saved-queries', label: 'Saved Queries' },
        { id: 'insights-archive', label: 'Insights Archive' },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const toggleMenu = (menuId: string) => {
    setExpandedMenu(expandedMenu === menuId ? '' : menuId);
  };

  const handleMenuClick = (menuId: string, submenuId?: string) => {
    if (submenuId) {
      onNavigate(menuId, submenuId);
    } else {
      onNavigate(menuId);
    }
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-800 transition-all duration-300 z-40 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Header */}
      <div className="h-20 border-b border-slate-800 flex items-center justify-between px-4">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">InsightAI</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? '' : 'rotate-180'}`} />
        </Button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
        {menuItems.map((item) => (
          <div key={item.id}>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-medium gap-3"
              onClick={() => {
                if (item.submenu) {
                  toggleMenu(item.id);
                } else {
                  handleMenuClick(item.id);
                }
              }}
            >
              {item.icon}
              {isOpen && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.submenu && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expandedMenu === item.id ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </>
              )}
            </Button>

            {/* Submenu */}
            {isOpen && item.submenu && expandedMenu === item.id && (
              <div className="ml-4 space-y-1 mt-2">
                {item.submenu.map((subitem) => (
                  <Button
                    key={subitem.id}
                    variant="ghost"
                    className="w-full justify-start text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    onClick={() => handleMenuClick(item.id, subitem.id)}
                  >
                    <span className="text-left py-2">{subitem.label}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-4">
        {isOpen && (
          <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-400">
            <p className="font-semibold text-slate-300 mb-1">💡 Tip</p>
            <p>Use natural language to query your data. Try: "Show revenue by region"</p>
          </div>
        )}
      </div>
    </div>
  );
}
