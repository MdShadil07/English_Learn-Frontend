// No API import needed for frontend-only implementation

export interface ProgressState {
  level: number;
  xp: number;
  totalXP: number;
  xpToNext: number;
  streak: number;
  totalSessions: number;
  progressPercentage: number;
  skills: {
    accuracy: number;
    vocabulary: number;
    grammar: number;
    pronunciation: number;
    fluency: number;
  };
}

export interface XPGainResult {
  xpGained: number;
  newTotalXP: number;
  levelInfo: {
    level: number;
    currentXP: number;
    xpToNextLevel: number;
    progressPercentage: number;
  };
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
}

/**
 * Frontend Progress Service
 * Manages user progress, XP, and level tracking with backend integration
 */
export class FrontendProgressService {
  private state: ProgressState = {
    level: 1,
    xp: 0,
    totalXP: 0,
    xpToNext: 500,
    streak: 0,
    totalSessions: 0,
    progressPercentage: 0,
    skills: {
      accuracy: 0,
      vocabulary: 0,
      grammar: 0,
      pronunciation: 0,
      fluency: 0,
    },
  };

  /**
   * Initialize progress from backend UserLevel data
   */
  async initialize(userId: string): Promise<ProgressState> {
    // Initialize with default values for frontend-only mode
    this.state = {
      level: 1,
      xp: 0,
      totalXP: 0,
      xpToNext: 500,
      streak: 0,
      totalSessions: 0,
      progressPercentage: 0,
      skills: {
        accuracy: 0,
        vocabulary: 0,
        grammar: 0,
        pronunciation: 0,
        fluency: 0,
      },
    };

    console.log(`📊 Progress initialized (frontend-only): Level ${this.state.level}, XP: ${this.state.totalXP}`);
    return this.state;
  }

  /**
   * Award XP to user
   */
  async awardXP(
    userId: string,
    action: string,
    multiplier: number = 1.0,
    customXP?: number
  ): Promise<XPGainResult> {
    // Calculate XP reward using local calculation
    const fallbackXP = this.getXPForAction(action) * multiplier;
    await this.updateProgressLocally(fallbackXP);

    console.log(`📊 XP awarded (local): +${fallbackXP} for ${action}, Level: ${this.state.level}`);
    return {
      xpGained: fallbackXP,
      newTotalXP: this.state.totalXP,
      levelInfo: {
        level: this.state.level,
        currentXP: this.state.xp,
        xpToNextLevel: this.state.xpToNext,
        progressPercentage: this.state.progressPercentage,
      },
      leveledUp: false,
      oldLevel: this.state.level,
      newLevel: this.state.level,
    };
  }

  /**
   * Update progress locally (fallback method)
   */
  private async updateProgressLocally(xpAmount: number): Promise<void> {
    this.state.totalXP += xpAmount;
    this.state.xp += xpAmount;

    // Check for level up
    while (this.state.xp >= this.state.xpToNext) {
      this.state.xp -= this.state.xpToNext;
      this.state.level += 1;
      this.state.xpToNext = this.calculateXPForNextLevel(this.state.level);
    }

    this.state.progressPercentage = Math.round((this.state.xp / this.state.xpToNext) * 100);

    // Update backend if possible
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        // TODO: Implement backend sync when API is available
        console.log('Would sync with backend:', { level: this.state.level, totalXP: this.state.totalXP });
      }
    } catch (error) {
      console.warn('Failed to sync progress with backend:', error);
    }
  }

  /**
   * Get XP for specific action type (frontend fallback)
   */
  private getXPForAction(action: string): number {
    const XP_REWARDS: Record<string, number> = {
      send_message: 10,
      receive_response: 5,
      complete_exercise: 25,
      daily_streak: 15,
      perfect_grammar: 20,
      vocabulary_milestone: 30,
      achievement_unlock: 50,
      level_up_bonus: 100,
      session_complete: 15,
      first_message: 10,
      long_conversation: 20,
    };

    return XP_REWARDS[action] || 5;
  }

  /**
   * Calculate XP required for next level (frontend fallback)
   */
  private calculateXPForNextLevel(currentLevel: number): number {
    return Math.floor(500 * Math.pow(1.1, currentLevel - 1));
  }

  /**
   * Update session (increments session count)
   */
  async updateSession(userId: string): Promise<ProgressState> {
    // Local update only
    this.state.totalSessions += 1;
    return this.state;
  }

  /**
   * Update user skills
   */
  async updateSkills(
    userId: string,
    skills: Partial<{
      accuracy: number;
      vocabulary: number;
      grammar: number;
      pronunciation: number;
      fluency: number;
    }>
  ): Promise<ProgressState> {
    // Local update only
    this.state.skills = {
      ...this.state.skills,
      ...skills,
    };

    return this.state;
  }

  /**
   * Get current progress state
   */
  getState(): ProgressState {
    return { ...this.state };
  }

  /**
   * Calculate average skill level
   */
  getAverageSkillLevel(): number {
    const { accuracy, vocabulary, grammar, pronunciation, fluency } = this.state.skills;
    const total = accuracy + vocabulary + grammar + pronunciation + fluency;
    const count = 5;
    return Math.round(total / count);
  }

  /**
   * Get progress summary for display
   */
  getProgressSummary(): {
    level: number;
    currentXP: number;
    xpToNext: number;
    progress: string;
    streak: number;
    sessions: number;
    averageSkill: number;
  } {
    return {
      level: this.state.level,
      currentXP: this.state.xp,
      xpToNext: this.state.xpToNext,
      progress: `${this.state.xp}/${this.state.xpToNext} XP`,
      streak: this.state.streak,
      sessions: this.state.totalSessions,
      averageSkill: this.getAverageSkillLevel(),
    };
  }

  /**
   * Reset progress state
   */
  reset(): void {
    this.state = {
      level: 1,
      xp: 0,
      totalXP: 0,
      xpToNext: 500,
      streak: 0,
      totalSessions: 0,
      progressPercentage: 0,
      skills: {
        accuracy: 0,
        vocabulary: 0,
        grammar: 0,
        pronunciation: 0,
        fluency: 0,
      },
    };
  }

  /**
   * Update only the accuracy skill
   */
  async updateAccuracy(userId: string, accuracy: number): Promise<void> {
    await this.updateSkills(userId, { accuracy });
    console.log(`📊 Updated accuracy to ${accuracy}% in progress service`);
  }
}

// Export singleton instance
export const progressService = new FrontendProgressService();
