import * as axios from "axios";

//===================================== configs

let axiosConfig = {
  baseURL: "http://localhost:3000/",
  headers : {
    'Content-Type': 'application/json'
  }
}
let axiosConfigFormData = {
  baseURL: "http://localhost:3000/",
  headers: {
    'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin" : "*"
  }
}

let axiosBearerTokenConfig = {
  baseURL: "http://localhost:3000/",
  headers: {
    'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
  }
}

let axiosConfigToken = {
  baseURL: "http://localhost:3000/",
  headers: {
    'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
    'Content-Type': 'Authorization',
    "Access-Control-Allow-Origin" : "*"
  }
}

let axiosConfigFile = {
  baseURL: "http://localhost:3000/",
  headers: {
  'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
  'Content-Type': 'application/json',
  "Access-Control-Allow-Origin" : "*"
  }
}


// ======================== Files ========================

export const filesAPI = {
  getFiles(url) {
    return axios.get(`/api/files${url ? url : ''}`, axiosConfigToken);  
  }, 
  
  searchFiles(search) {
    return axios.get(`/api/files/search?search=${search}`, axiosBearerTokenConfig);  
  },

  createDir(dirId, name) {
    return axios.post(`/api/files`, JSON.stringify({name,  type: 'dir', parent: dirId }) , axiosConfigFile);  
  },  
  
  deleteFiles(file) {
    return axios.delete(`/api/files?id=${file._id}` , axiosBearerTokenConfig);  
  },
}

// ======================== Users ========================

export const usersAPI = {
  // getUsers(currentPage = 1, pageSize = 10) {
  //   return instance
  //     .get(`users?page=${currentPage}&count=${pageSize}`)
  //     .then((response) => {
  //       return response.data;
  //     });
  // },

  getUsers(currentPage = 1, pageSize = 10) {
    return axios.get(`/api/humans`).then( response => {
      return response.data;
    })
  },

  // follow(id) {
  //   return instance.post(`follow/${id}`).then((response) => {
  //     return response.data;
  //   });
  // },

  // unFollow(id) {
  //   return instance.delete(`follow/${id}`).then((response) => {
  //     return response.data;
  //   });
  // },
};

// ======================== Profile ========================

export const profileAPI = {

  getProfile(userId) {
    return axios.get(`api/profile/${userId}`, axiosConfig);
  },   
  
  uploadAvatar(formData) {
    return axios.post(`api/files/avatar`, formData, axiosConfigFormData);
  },  
  
  deleteAvatar() {
    return axios.delete(`api/files/avatar`, axiosBearerTokenConfig);
  }, 

  // getProfile(userId) {
  //   return instance.get(`profile/` + userId).then((response) => {
  //     return response.data;
  //   });
  // },

  // getStatus(userId) {
  //   return instance.get(`profile/status/` + userId).then((response) => {
  //     return response.data;
  //   });
  // },

  // updateStatus(status) {
  //   return instance.put(`profile/status`, { status: status });
  // },

  // savePhoto(photoFile) {
  //   const formData = new FormData();
  //   formData.append("image", photoFile);
  //   return instance.put(`profile/photo`, formData, {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });
  // },

  // saveProfile(profile) {
  //   return instance.put(`profile`, profile);
  // },
};

// ======================== Auth ========================

export const authMeAPI = {
  authMe() {
    return axios.get(`api/auth/me`, axiosConfigToken)
  },

  login(form) {
    return axios.post(`api/auth/login`, JSON.stringify(form), axiosConfig);
  },  
  
  register(form) {
    return axios.post(`api/auth/register`, JSON.stringify(form), axiosConfig)
  },

};

