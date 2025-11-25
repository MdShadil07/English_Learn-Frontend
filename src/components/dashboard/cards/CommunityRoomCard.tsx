import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Video, Users, Clock, UserCheck, Zap, ArrowRight, Calendar, Headphones } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Refined theme configuration for rooms
const roomConfig = {
  live: {
    borderHover: 'group-hover:border-emerald-500/30',
    bg: 'bg-white/80 dark:bg-slate-900/80',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    statusBadge: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    button: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
    glow: 'from-emerald-500/5'
  },
  scheduled: {
    borderHover: 'group-hover:border-blue-500/30',
    bg: 'bg-white/60 dark:bg-slate-900/60',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    statusBadge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    button: 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700',
    glow: 'from-blue-500/5'
  }
};

const CommunityRoomCard = ({ rooms = [] }) => {
  const safeRooms = Array.isArray(rooms) ? rooms : [];

  if (safeRooms.length === 0) {
    return (
      <div className="p-8 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <p className="text-sm text-slate-500 dark:text-slate-400">No active rooms right now.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {safeRooms.map((room, index) => {
        const isLive = room.status === 'live';
        const theme = roomConfig[isLive ? 'live' : 'scheduled'];

        return (
          <motion.div
            key={room.name || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="group relative"
          >
            <div className={cn(
              "relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 transition-all duration-300 p-4 sm:p-5 backdrop-blur-sm",
              theme.bg,
              theme.borderHover,
              "hover:shadow-lg hover:-translate-y-0.5"
            )}>
              
              {/* Subtle Gradient Glow on Hover */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-r to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
                theme.glow
              )} />

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                
                {/* Left: Icon & Live Indicator */}
                <div className="flex items-center justify-between w-full sm:w-auto">
                  <div className={cn(
                    "relative flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm",
                    theme.iconBg
                  )}>
                    {isLive ? (
                      <>
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-slate-900"></span>
                        </span>
                        <Video className={cn("w-6 h-6", theme.iconColor)} strokeWidth={2} />
                      </>
                    ) : (
                      <Calendar className={cn("w-6 h-6", theme.iconColor)} strokeWidth={2} />
                    )}
                  </div>

                  {/* Mobile-only Status Badge (Right aligned) */}
                  <div className="sm:hidden">
                     <Badge variant="secondary" className={cn("h-6 px-2 text-[10px] font-bold uppercase tracking-wider border-0", theme.statusBadge)}>
                      {isLive ? 'Live Now' : 'Upcoming'}
                    </Badge>
                  </div>
                </div>

                {/* Middle: Room Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                      {room.name}
                    </h4>
                    {/* Desktop-only Status Badge */}
                    <Badge variant="secondary" className={cn("hidden sm:inline-flex h-5 px-1.5 text-[10px] font-bold uppercase tracking-wider border-0", theme.statusBadge)}>
                      {isLive ? 'Live' : 'Soon'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span className="font-medium">{room.members} {isLive ? 'listening' : 'waiting'}</span>
                    </div>
                    <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span className="font-medium">{room.level}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Action Button */}
                <div className="w-full sm:w-auto pt-2 sm:pt-0">
                  <Button 
                    size="sm" 
                    className={cn(
                      "w-full sm:w-auto h-10 sm:h-9 rounded-xl text-xs font-bold shadow-sm transition-all duration-300 group/btn relative overflow-hidden border-0",
                      theme.button
                    )}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLive ? (
                        <>
                          Join <span className="hidden sm:inline">Session</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                        </>
                      ) : (
                        <>
                          Notify Me
                          <Clock className="w-3.5 h-3.5 ml-0.5" />
                        </>
                      )}
                    </span>
                    {/* Subtle shimmer on hover for live button */}
                    {isLive && (
                      <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
                    )}
                  </Button>
                </div>

              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default memo(CommunityRoomCard);