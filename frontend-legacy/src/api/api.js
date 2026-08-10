import * as axios from "axios";

const instance = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ======================== Files ========================

export const filesAPI = {
  getFiles(url) {
    return instance.get(`/api/files${url ? url : ""}`);
  },

  searchFiles(search) {
    return instance.get(`/api/files/search?search=${search}`);
  },

  createDir(dirId, name) {
    return instance.post(`/api/files`, { name, type: "dir", parent: dirId });
  },

  deleteFiles(file) {
    return instance.delete(`/api/files?id=${file._id}`);
  },
};

// ======================== Users ========================

export const usersAPI = {
  getUsers(currentPage = 1, pageSize = 10) {
    return instance.get(`/api/humans`).then((response) => {
      return response.data;
    });
  },
};

// ======================== Profile ========================

export const profileAPI = {
  getProfile(userId) {
    return instance.get(`/api/profile/${userId}`);
  },

  uploadAvatar(formData) {
    return instance.post(`/api/files/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteAvatar() {
    return instance.delete(`/api/files/avatar`);
  },
};

// ======================== Auth ========================

export const authMeAPI = {
  authMe() {
    return instance.get(`/api/auth/me`);
  },

  login(form) {
    return instance.post(`/api/auth/login`, form);
  },

  register(form) {
    return instance.post(`/api/auth/register`, form);
  },
};
