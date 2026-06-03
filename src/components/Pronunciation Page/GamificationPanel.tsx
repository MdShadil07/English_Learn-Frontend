import React, { useEffect, useState } from 'react';

export default function GamificationPanel({ attempt }) {
  const [badges, setBadges] = useState<any[]>(attempt?.badges || []);

  useEffect(() => {
    if (attempt?.badges) setBadges(attempt.badges);
  }, [attempt]);

  return (
    <div className="rounded-xl border p-3 bg-white/80 dark:bg-slate-900/60">
      <h4 className="font-bold text-sm">Achievements</h4>
      <div className="mt-2 flex gap-2 flex-wrap">
        {badges.length ? badges.map(b=> (
          <div key={b.id} className="px-3 py-1 rounded-md bg-indigo-50 dark:bg-indigo-900 text-sm">
            <div className="font-semibold">{b.name}</div>
            <div className="text-xs text-slate-500">{b.description}</div>
          </div>
        )) : <div className="text-xs text-slate-400">No badges yet — keep practicing!</div>}
      </div>
    </div>
  );
}
