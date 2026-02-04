import { supabase, TABLES } from "./supabase.js";

// Recovery History Operations
export const recoveryHistoryService = {
  // Save a recovery attempt to database
  async saveRecoveryAttempt(userId, recoveryData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.RECOVERY_HISTORY)
        .insert({
          user_id: userId,
          domain: recoveryData.domain,
          goal: recoveryData.goal,
          time_gap: recoveryData.time_gap,
          reason: recoveryData.reason,
          capacity: recoveryData.capacity,
          strategy: recoveryData.strategy,
          next_step: recoveryData.next_step,
          stop_condition: recoveryData.stop_condition,
          rationale: recoveryData.rationale,
          safety_note: recoveryData.safety_note,
          trace_id: recoveryData.trace_id,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error saving recovery attempt:", error);
      throw error;
    }
  },

  // Get user's recovery history
  async getUserHistory(userId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from(TABLES.RECOVERY_HISTORY)
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching user history:", error);
      throw error;
    }
  },

  // Update feedback for a recovery attempt
  async updateFeedback(traceId, feedback) {
    try {
      const { data, error } = await supabase
        .from(TABLES.RECOVERY_HISTORY)
        .update({ feedback: feedback })
        .eq("trace_id", traceId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating feedback:", error);
      throw error;
    }
  },
};

// User Operations
export const userService = {
  // Get user profile
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update(updates)
        .eq("id", userId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },
};
