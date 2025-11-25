import React from 'react';

const RouteLoading: React.FC = () => {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center p-6">
      <div className="space-y-2 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent" />
        <div className="text-sm text-slate-500">Loading…</div>
      </div>
    </div>
  );
};

export default RouteLoading;
