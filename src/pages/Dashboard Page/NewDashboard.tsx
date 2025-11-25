import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import NewDashboardLayout from '../../components/dashboard/NewDashboardLayout';
import NewDashboardHome from '../../components/dashboard/NewDashboardHome';
import GrammarView from '../../components/dashboard/features/GrammarView';
// Update the import path below to the correct relative path if the file exists elsewhere, for example:
import VocabularyView from '../../components/dashboard/features/VocabularyView';
// Or, if the file is missing, create VocabularyView.tsx in the expected directory.
import WritingView from '../../components/dashboard/features/WritingView';
// import ReadingView from '@/components/dashboard/features/ReadingView';
import ReadingView from '../../components/dashboard/features/ReadingView';
import RoomsView from '../../components/dashboard/features/RoomsView';
import NotesView from '../../components/dashboard/features/NotesView';
import CommunityView from '../../components/dashboard/features/CommunityView';
import FocusModeView from '../../components/dashboard/features/FocusModeView';
import AIChat from '../../pages/AI Chat Page/AIChatPage';
import AIPractice from '../../components/dashboard/AIPractice';
import VoiceRooms from '../../components/dashboard/VoiceRooms';
import { useAuth } from '../../contexts/AuthContext';
import UpgradeToast from '@/components/ui/UpgradeToast';
import AnalyticsDashboard from '../../pages/Analytic Page/AnalyticsDashboard';

const NewDashboard = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<string>('home');
  // Compute premium status and render reusable toast component near top-level so it shows on dashboard
  const subscriptionTier = (user?.tier || 'free').toString().toLowerCase();
  const isPremiumUser = subscriptionTier === 'premium' || subscriptionTier === 'pro';

  const _upgradeToast = <UpgradeToast isPremiumUser={isPremiumUser} />;

  // Show a celebratory toast/modal when redirected from payment return
  const location = useLocation();
  const shownRef = useRef(false);
  const toastGlobal = (window as unknown as { toast?: (opts: { title?: string; description?: string }) => void }).toast;

  useEffect(() => {
    try {
      if (shownRef.current) return;
      // Prioritize react-router location.state, then history.state, then fallback global
      const navState = (location && (location.state as unknown as Record<string, unknown>)) || (window.history && (window.history.state as unknown as Record<string, unknown>)) || (window as unknown as { __navigateToDashboardState?: unknown }).__navigateToDashboardState || null;
      const navStateRec = navState as Record<string, unknown> | null;
      if (navStateRec && (navStateRec['upgraded'] as boolean)) {
        const sub = (navStateRec['subscription'] as Record<string, unknown> | null) || null;
        const subRec = sub as Record<string, unknown> | null;
        const planName = subRec ? String(((subRec['planId'] as Record<string, unknown> | undefined)?.['name']) || subRec['tier'] || 'Premium') : 'Premium';
        const planType = subRec ? String(subRec['planType'] || '') : '';
        const endDate = subRec && subRec['endDate'] ? new Date(String(subRec['endDate'])).toLocaleDateString() : null;
        // Use existing toast hook if available via context, otherwise fallback to window alert
        try {
          if (typeof toastGlobal === 'function') {
            toastGlobal({ title: 'Subscription activated', description: `You've been upgraded to ${planName} ${planType}${endDate ? ` until ${endDate}` : ''}` });
          } else {
            // Fallback: simple alert when toast not available
            alert(`Congratulations! You've been upgraded to ${planName} ${planType}${endDate ? ` until ${endDate}` : ''}`);
          }
        } catch (err) {
          // As a last resort, use alert
          alert(`Congratulations! You've been upgraded to ${planName} ${planType}${endDate ? ` until ${endDate}` : ''}`);
        }

        // Clear nav state so toast doesn't reappear on refresh
        try {
          window.history.replaceState({}, '', window.location.pathname);
        } catch (err) {
          console.debug('Failed to clear history state after upgrade toast', err);
        }
        try {
          (window as unknown as { __navigateToDashboardState?: unknown }).__navigateToDashboardState = undefined;
        } catch (err) {
          console.debug('Failed to clear navigateToDashboardState global', err);
        }
        shownRef.current = true;
      }
    } catch (err) {
      console.debug('Dashboard upgrade toast handling failed', err);
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <NewDashboardHome />;
      case 'grammar':
        return <GrammarView />;
      case 'vocabulary':
        return <VocabularyView />;
      case 'writing':
        return <WritingView />;
      case 'reading':
        return <ReadingView />;
      case 'ai-chat':
        return <AIChat />;
      case 'ai-practice':
        return <AIPractice />;
      case 'rooms':
        return <RoomsView />;
      case 'voice-rooms':
        return <VoiceRooms />;
      case 'notes':
        return <NotesView />;
      case 'focus':
        return <FocusModeView />;
      case 'community':
        return <CommunityView />;
      case 'listening':
        return <ReadingView />; // Placeholder - create dedicated component later
      case 'speaking':
        return <AIPractice />; // Placeholder - create dedicated component later
      case 'ai-tutor':
        return <AIChat />; // Placeholder - create dedicated component later
      case 'bookmarks':
        return <NotesView />; // Placeholder - create dedicated component later
      case 'analytics':
        return <AnalyticsDashboard />;
      default:
        return <NewDashboardHome />;
    }
  };

  return (
    <NewDashboardLayout activeView={activeView} onViewChange={setActiveView}>
      {/* Mount upgrade toast so it runs its effect when dashboard renders */}
      <UpgradeToast isPremiumUser={isPremiumUser} />
      {renderView()}
    </NewDashboardLayout>
  );
};

export default NewDashboard;
