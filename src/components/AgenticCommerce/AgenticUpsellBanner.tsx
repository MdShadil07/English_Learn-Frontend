import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, TrendingUp, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

interface AgenticOffer {
  headline: string;
  pitchText: string;
  discountCode?: string;
  discountPercentage?: number;
}

export const AgenticUpsellBanner: React.FC = () => {
  const { user, token } = useAuth();
  const [offer, setOffer] = useState<AgenticOffer | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffer = async () => {
      if (!user || !token) return;
      
      // If user is already pro/premium, no need to fetch
      const tier = user.tier?.toLowerCase() || 'free';
      if (tier !== 'free') {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/commerce/agentic-offer`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        if (data.success && data.hasOffer) {
          setOffer(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch Agentic offer', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [user, token]);

  if (loading || !offer || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -20, height: 0 }}
        className="w-full mb-6"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 p-[1px]">
          {/* Animated border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 opacity-30 animate-pulse" />
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl bg-slate-950/80 p-5 backdrop-blur-xl">
            {/* Left side content */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {offer.headline}
                    {offer.discountPercentage ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                        {offer.discountPercentage}% OFF
                      </span>
                    ) : null}
                  </h3>
                </div>
                <p className="mt-1 text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {offer.pitchText}
                </p>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex w-full md:w-auto items-center gap-3 shrink-0">
              <Button 
                onClick={() => navigate('/pricing')}
                className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-105"
              >
                Claim Offer <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <button 
                onClick={() => setIsVisible(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                aria-label="Dismiss offer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AgenticUpsellBanner;
