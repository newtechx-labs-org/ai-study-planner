import api from "@/lib/api";

export async function getSubjects() {
  const res = await api.get("/subjects");
  return res.data;
}

export async function createSubject(payload) {
  const res = await api.post("/subjects", payload);
  return res.data;
}

export async function updateSubject(subjectId, payload) {
  const res = await api.put(`/subjects/${subjectId}`, payload);
  return res.data;
}

export async function deleteSubject(subjectId) {
  await api.delete(`/subjects/${subjectId}`);
}
