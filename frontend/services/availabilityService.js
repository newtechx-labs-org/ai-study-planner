import api from "@/lib/api";

export async function getAvailability() {
  const res = await api.get("/availability");
  return res.data;
}

export async function setAvailability(payload) {
  const res = await api.post("/availability", payload);
  return res.data;
}
