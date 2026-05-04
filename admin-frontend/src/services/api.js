import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
});

const handle = (res) => res.data.data || res.data;


// ================= USERS =================
export const getUsers = async () => {
  const res = await api.get("/users");
  return handle(res);
};

// ================= USERS WITH SCANS =================
export const getUsersWithScans = async () => {
  const res = await api.get("/admin/users-with-scans");
  return handle(res);
};

// ================= DASHBOARD =================
export const getDashboardStats = async () => {
  const res = await api.get("/admin/stats");
  return res.data;
};

// ================= DISEASE =================
export const getDiseaseStats = async () => {
  const res = await api.get("/admin/disease-stats");
  return res.data;
};

// ================= SCANS =================
export const getScans = async () => {
  const res = await api.get("/admin/all-scans");
  return handle(res);
};

// ================= APPOINTMENTS =================
export const getAppointments = async () => {
  const res = await api.get("/admin/appointments");
  return handle(res);
};