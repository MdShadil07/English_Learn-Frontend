import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Clock, Award } from "lucide-react";

const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSessions: 0,
    totalPracticeTime: 0,
    avgScore: 0,
    activeToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Get total users
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total sessions
      const { data: sessions, count: sessionCount } = await supabase
        .from('speaking_sessions')
        .select('duration, overall_score', { count: 'exact' });

      // Calculate total practice time and average score
      const totalTime = sessions?.reduce((acc, s) => acc + s.duration, 0) || 0;
      const avgScore = sessions?.length 
        ? sessions.reduce((acc, s) => acc + s.overall_score, 0) / sessions.length 
        : 0;

      // Get active users today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: activeCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('last_practice_date', today.toISOString().split('T')[0]);

      setStats({
        totalUsers: userCount || 0,
        totalSessions: sessionCount || 0,
        totalPracticeTime: totalTime,
        avgScore: Math.round(avgScore * 10) / 10,
        activeToday: activeCount || 0,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-primary/10 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-lg">
              <Users className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-accent/10 border-accent/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent rounded-lg">
              <TrendingUp className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
              <p className="text-3xl font-bold">{stats.totalSessions}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-success/10 border-success/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-success rounded-lg">
              <Clock className="h-6 w-6 text-success-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Practice</p>
              <p className="text-2xl font-bold">{formatTime(stats.totalPracticeTime)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-subtle border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary rounded-lg">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Score</p>
              <p className="text-3xl font-bold">{stats.avgScore}/10</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Activity Overview</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Active Users Today</span>
              <span className="text-sm text-muted-foreground">{stats.activeToday} users</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-all"
                style={{ width: `${(stats.activeToday / stats.totalUsers) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Average Engagement</span>
              <span className="text-sm text-muted-foreground">
                {stats.totalUsers > 0 ? Math.round(stats.totalSessions / stats.totalUsers) : 0} sessions/user
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-gradient-accent h-2 rounded-full transition-all"
                style={{ width: `${Math.min((stats.totalSessions / stats.totalUsers / 10) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminAnalytics;