import api from "@/lib/api";

export async function getProgress(planId) {
  const query = planId ? { params: { plan_id: planId } } : undefined;
  const res = await api.get("/progress", query);
  return res.data;
}

export async function markComplete(sessionId, completedHours) {
  const res = await api.post("/mark-complete", {
    session_id: sessionId,
    completed_hours: completedHours,
  });
  return res.data;
}
