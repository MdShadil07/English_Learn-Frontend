import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const CommunityRoomCard = ({ rooms = [] }) => {
  const safeRooms = Array.isArray(rooms) ? rooms : [];
  const displayRooms = safeRooms.slice(0, 4);

  if (displayRooms.length === 0) {
    return (
      <div className="p-6 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <p className="text-sm text-slate-500 dark:text-slate-400">No active rooms right now.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayRooms.map((room, index) => {
        const isLive = room.status === 'live';
        const iconBg = isLive 
          ? "bg-gradient-to-br from-emerald-500 to-teal-500" 
          : "bg-gradient-to-br from-blue-500 to-indigo-500";
        const textColor = isLive 
          ? "text-emerald-700 dark:text-emerald-400" 
          : "text-blue-700 dark:text-blue-400";
        const bgColor = isLive 
          ? "bg-emerald-100/60 dark:bg-emerald-900/30" 
          : "bg-blue-100/60 dark:bg-blue-900/30";

        return (
          <motion.div 
            key={room.name || index} 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-emerald-200">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden", iconBg)}>
                {room.banner ? (
                  <img 
                    src={room.banner} 
                    alt="Room Banner" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Users className="h-5 w-5 text-white" />
                )}
              </div>

              <div className="flex-1">
                <h4 className={cn("text-sm font-semibold mb-2", textColor)}>
                  {room.name}
                </h4>

                <div className="flex items-center gap-3 flex-wrap">
                  <span className={cn("text-xs px-3 py-1 rounded-full border", bgColor, textColor)}>
                    {isLive ? 'Live Now' : 'Upcoming'}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-100/60 text-emerald-700 flex items-center gap-1.5">
                    <Users className="h-3 w-3" /> {room.members}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-slate-100/60 text-slate-700 flex items-center gap-1.5">
                    {room.level}
                  </span>
                  {room.description && (
                    <span className="text-xs px-3 py-1 rounded-full bg-purple-100/60 text-purple-700">
                      {room.description}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CommunityRoomCard;