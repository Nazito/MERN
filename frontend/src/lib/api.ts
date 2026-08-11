import axios from "axios";
import { notifyFromServer } from "@/lib/notificationBus";

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.msg ||
        error?.message;

      if (message && error?.response?.status !== 401) {
        notifyFromServer({ message: String(message), severity: "error" });
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  me: () => api.get("/api/auth/me"),
  login: (form: { email: string; password: string }) =>
    api.post("/api/auth/login", form),
  register: (form: { email: string; password: string; name: string }) =>
    api.post("/api/auth/register", form),
  forgotPassword: (form: { email: string }) =>
    api.post("/api/auth/forgot-password", form),
  resetPassword: (form: { token: string; password: string }) =>
    api.post("/api/auth/reset-password", form),
};

export const usersAPI = {
  getUsers: () => api.get("/api/humans").then((r) => r.data),
};

export const profileAPI = {
  getProfile: (userId: string) => api.get(`/api/profile/${userId}`),
  updateProfile: (data: { name?: string; bio?: string }) =>
    api.patch("/api/profile", data),
  uploadAvatar: (formData: FormData) =>
    api.post("/api/files/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteAvatar: () => api.delete("/api/files/avatar"),
};

export const friendsAPI = {
  list: () => api.get("/api/friends"),
  ofUser: (userId: string) => api.get(`/api/friends/of/${userId}`),
  requests: () => api.get("/api/friends/requests"),
  status: (userId: string) => api.get(`/api/friends/status/${userId}`),
  sendRequest: (userId: string) => api.post(`/api/friends/${userId}`),
  accept: (userId: string) => api.post(`/api/friends/${userId}/accept`),
  decline: (userId: string) => api.post(`/api/friends/${userId}/decline`),
  remove: (userId: string) => api.delete(`/api/friends/${userId}`),
};

export const messagesAPI = {
  conversations: () => api.get("/api/messages/conversations"),
  openConversation: (userId: string) =>
    api.post("/api/messages/conversations", { userId }),
  getConversation: (id: string) =>
    api.get(`/api/messages/conversations/${id}`),
  messages: (conversationId: string) =>
    api.get(`/api/messages/conversations/${conversationId}/messages`),
  send: (conversationId: string, text: string) =>
    api.post(`/api/messages/conversations/${conversationId}/messages`, {
      text,
    }),
};

export function avatarUrl(avatar?: string | null) {
  if (!avatar) return undefined;
  // Cloudinary (or any absolute URL). Legacy local filenames are ignored.
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
    return avatar;
  }
  return undefined;
}

export const filesAPI = {
  getFiles: (url = "") => api.get(`/api/files${url}`),
  searchFiles: (search: string) =>
    api.get(`/api/files/search?search=${search}`),
  createDir: (dirId: string | null, name: string) =>
    api.post("/api/files", { name, type: "dir", parent: dirId }),
  deleteFiles: (fileId: string) => api.delete(`/api/files?id=${fileId}`),
};

export default api;
