class TrackingService {
  constructor() {
    this.events = [];
    this.currentUserId = null;
  }

  setUser(userId) {
    this.currentUserId = userId;
    this.loadFromStorage();
  }

  clearUser() {
    this.currentUserId = null;
    this.events = [];
  }

  getStorageKey() {
    return this.currentUserId
      ? `recoveryTracking_${this.currentUserId}`
      : "recoveryTracking";
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem(this.getStorageKey());
      if (saved) {
        this.events = JSON.parse(saved);
      } else {
        this.events = [];
      }
    } catch (error) {
      console.error("Error loading tracking data:", error);
      this.events = [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(this.events));
    } catch (error) {
      console.error("Error saving tracking data:", error);
    }
  }

  // Track when user starts a new recovery process
  trackRecoveryStart(userId, sessionId) {
    const event = {
      id: this.generateId(),
      type: "recovery_start",
      userId,
      sessionId,
      timestamp: new Date().toISOString(),
      data: {},
    };
    this.events.push(event);
    this.saveToStorage();
    return event.id;
  }

  // Track when user submits input form
  trackInputSubmitted(sessionId, inputData) {
    const event = {
      id: this.generateId(),
      type: "input_submitted",
      sessionId,
      timestamp: new Date().toISOString(),
      data: {
        domain: inputData.domain,
        goal: inputData.goal,
        time_gap: inputData.time_gap,
        reason: inputData.reason,
        capacity: inputData.capacity,
      },
    };
    this.events.push(event);
    this.saveToStorage();
    return event;
  }

  // Track when AI generates recovery step
  trackRecoveryGenerated(sessionId, recoveryData, traceId) {
    const event = {
      id: this.generateId(),
      type: "recovery_generated",
      sessionId,
      timestamp: new Date().toISOString(),
      data: {
        domain: recoveryData.domain,
        strategy: recoveryData.strategy,
        next_step: recoveryData.next_step,
        stop_condition: recoveryData.stop_condition,
        rationale: recoveryData.rationale,
        safety_note: recoveryData.safety_note,
        capacity_minutes: recoveryData.capacity_minutes,
        trace_id: traceId,
      },
    };
    this.events.push(event);
    this.saveToStorage();
    return event;
  }

  // Track when user provides feedback
  trackFeedbackSubmitted(sessionId, traceId, feedback) {
    const event = {
      id: this.generateId(),
      type: "feedback_submitted",
      sessionId,
      timestamp: new Date().toISOString(),
      data: {
        trace_id: traceId,
        feedback: feedback,
      },
    };
    this.events.push(event);
    this.saveToStorage();
    return event;
  }

  // Get all events for a session
  getSessionEvents(sessionId) {
    return this.events.filter((event) => event.sessionId === sessionId);
  }

  // Get recovery history (completed recoveries with feedback)
  getRecoveryHistory() {
    const recoveries = [];
    const sessions = new Map();

    // Group events by session (already filtered by current user via storage key)
    this.events.forEach((event) => {
      if (!sessions.has(event.sessionId)) {
        sessions.set(event.sessionId, []);
      }
      sessions.get(event.sessionId).push(event);
    });

    // Build recovery objects from complete sessions
    sessions.forEach((sessionEvents, sessionId) => {
      const inputEvent = sessionEvents.find(
        (e) => e.type === "input_submitted",
      );
      const recoveryEvent = sessionEvents.find(
        (e) => e.type === "recovery_generated",
      );
      const feedbackEvent = sessionEvents.find(
        (e) => e.type === "feedback_submitted",
      );

      if (inputEvent && recoveryEvent) {
        const recovery = {
          id: sessionId,
          date: recoveryEvent.timestamp,
          domain: inputEvent.data.domain,
          goal: inputEvent.data.goal,
          time_gap: inputEvent.data.time_gap,
          reason: inputEvent.data.reason,
          capacity: inputEvent.data.capacity,
          strategy: recoveryEvent.data.strategy,
          next_step: recoveryEvent.data.next_step,
          stop_condition: recoveryEvent.data.stop_condition,
          rationale: recoveryEvent.data.rationale,
          safety_note: recoveryEvent.data.safety_note,
          capacity_minutes: recoveryEvent.data.capacity_minutes,
          trace_id: recoveryEvent.data.trace_id,
          feedback: feedbackEvent ? feedbackEvent.data.feedback : null,
          feedback_timestamp: feedbackEvent ? feedbackEvent.timestamp : null,
        };
        recoveries.push(recovery);
      }
    });

    // Sort by date (newest first)
    recoveries.sort((a, b) => new Date(b.date) - new Date(a.date));

    return recoveries;
  }

  // Get statistics for current user
  getStats() {
    const history = this.getRecoveryHistory();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const thisWeek = history.filter((r) => new Date(r.date) >= weekAgo);
    const withFeedback = history.filter((r) => r.feedback);

    return {
      total: history.length,
      thisWeek: thisWeek.length,
      successRate:
        withFeedback.length > 0
          ? Math.round(
              (withFeedback.filter((r) => r.feedback === "did_it").length /
                withFeedback.length) *
                100,
            )
          : 0,
    };
  }

  // Clear old events (keep last 1000)
  cleanup() {
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
      this.saveToStorage();
    }
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }
}

// Export singleton instance
export const trackingService = new TrackingService();
