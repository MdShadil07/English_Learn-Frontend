// Centralized tier normalization utilities
export type Tier = 'free' | 'pro' | 'premium';

export function resolveUserTier(u: unknown): Tier {
  if (!u) return 'free';
  const obj = u as Record<string, unknown>;
  const directTier = (obj.tier ?? obj.subscriptionTier) as string | undefined;
  if (directTier && typeof directTier === 'string') {
    const t = directTier.toLowerCase();
    if (t === 'premium' || t === 'pro' || t === 'free') return t as Tier;
  }

  const subDetails = obj.subscriptionDetails as Record<string, unknown> | undefined;
  if (subDetails && typeof subDetails.tier === 'string') {
    const t = subDetails.tier.toLowerCase();
    if (t === 'premium' || t === 'pro' || t === 'free') return t as Tier;
  }

  if (obj.isPremium === true) return 'premium';
  if (obj.isPro === true) return 'pro';

  const p = obj.profile as Record<string, unknown> | undefined;
  if (p) {
    if (p.isPremium === true) return 'premium';
    if (p.isPro === true) return 'pro';
    const subscriptionStatus = p.subscriptionStatus as string | undefined;
    if (typeof subscriptionStatus === 'string') {
      const ss = subscriptionStatus.toLowerCase();
      if (ss === 'premium') return 'premium';
      if (ss === 'pro') return 'pro';
    }
  }

  const legacySub = obj.subscriptionStatus as string | undefined;
  if (typeof legacySub === 'string') {
    const ls = legacySub.toLowerCase();
    if (ls === 'premium') return 'premium';
    if (ls === 'pro') return 'pro';
  }

  return 'free';
}

export function mapTierToStatus(t: Tier | null | undefined): string {
  if (!t) return 'none';
  if (t === 'free') return 'free';
  if (t === 'pro') return 'pro';
  if (t === 'premium') return 'premium';
  return 'none';
}
