import api from "@/lib/api";

export async function generatePlan(payload) {
  const res = await api.post("/generate-plan", payload);
  return res.data;
}

export async function getPlans() {
  const res = await api.get("/plans");
  return res.data;
}

export async function getPlanDetails(planId) {
  const res = await api.get(`/plans/${planId}`);
  return res.data;
}

export async function adjustPlan(planId, reason = "missed_sessions") {
  const res = await api.post(`/plans/${planId}/adjust`, { reason });
  return res.data;
}

export async function deletePlan(planId) {
  const res = await api.delete(`/plans/${planId}`);
  return res.data;
}

export async function deleteAllPlans() {
  const res = await api.delete("/plans");
  return res.data;
}
