import api from "@/lib/api";

export async function getReminder() {
  const res = await api.get("/reminders");
  return res.data;
}

export async function setReminder(payload) {
  const res = await api.post("/reminders", payload);
  return res.data;
}

export async function deleteReminder() {
  const res = await api.delete("/reminders");
  return res.data;
}

export async function getNextReminder() {
  const res = await api.get("/reminders/next");
  return res.data;
}
