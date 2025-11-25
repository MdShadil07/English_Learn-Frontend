import React from 'react';
import { MessageSquare, Settings } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { AIPersonality } from './types';

interface AIChatHeaderProps {
  selectedPersonality: AIPersonality;
  availablePersonalities: AIPersonality[];
  onSelectPersonality: (personality: AIPersonality) => void;
  showSettings: boolean;
  onToggleSettings: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const AIChatHeader: React.FC<AIChatHeaderProps> = ({
  selectedPersonality,
  availablePersonalities,
  onSelectPersonality,
  showSettings,
  onToggleSettings,
  sidebarOpen,
  onToggleSidebar
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className={cn(
            'lg:hidden text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50',
            'dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-900/30'
          )}
          aria-label={sidebarOpen ? 'Hide conversation list' : 'Show conversation list'}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center text-xl font-medium bg-gradient-to-br',
              `from-${selectedPersonality.color}-400 to-${selectedPersonality.color}-600`
            )}
            aria-hidden="true"
          >
            {selectedPersonality.avatar}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedPersonality.name}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selectedPersonality.description}
            </p>
          </div>
          <Badge variant={selectedPersonality.tier === 'premium' ? 'default' : 'secondary'}>
            {selectedPersonality.tier}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={selectedPersonality.id}
          onValueChange={(value) => {
            const personality = availablePersonalities.find((item) => item.id === value);
            if (personality) {
              onSelectPersonality(personality);
            }
          }}
        >
          <SelectTrigger className="w-48 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-emerald-200/30 dark:border-emerald-700/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availablePersonalities.map((personality) => (
              <SelectItem key={personality.id} value={personality.id}>
                <div className="flex items-center gap-2">
                  <span aria-hidden="true">{personality.avatar}</span>
                  <span>{personality.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {personality.tier}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSettings}
          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-900/30"
          aria-pressed={showSettings}
          aria-label="Toggle settings panel"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default AIChatHeader;
