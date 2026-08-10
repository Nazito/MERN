import axios from "axios";

const api = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const authAPI = {
  me: () => api.get("/api/auth/me"),
  login: (form: { email: string; password: string }) =>
    api.post("/api/auth/login", form),
  register: (form: { email: string; password: string; name: string }) =>
    api.post("/api/auth/register", form),
};

export const usersAPI = {
  getUsers: () => api.get("/api/humans").then((r) => r.data),
};

export const profileAPI = {
  getProfile: (userId: string) => api.get(`/api/profile/${userId}`),
  uploadAvatar: (formData: FormData) =>
    api.post("/api/files/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteAvatar: () => api.delete("/api/files/avatar"),
};

export const filesAPI = {
  getFiles: (url = "") => api.get(`/api/files${url}`),
  searchFiles: (search: string) =>
    api.get(`/api/files/search?search=${search}`),
  createDir: (dirId: string | null, name: string) =>
    api.post("/api/files", { name, type: "dir", parent: dirId }),
  deleteFiles: (fileId: string) => api.delete(`/api/files?id=${fileId}`),
};

export default api;
