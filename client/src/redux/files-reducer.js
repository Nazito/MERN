import { constants } from "buffer";
import { filesAPI } from "../api/api";
import { addUploadFile, changeUploadFile, showUploader } from "./upload-reducer";
import * as axios from "axios";

const SET_FILES = 'SET_FILES'
const SET_CURRENT_DIR = 'SET_CURRENT_DIR'
const ADD_FILE = 'ADD_FILE'
const PUSH_TO_STACK = 'PUSH_TO_STACK'
const POP_FROM_STACK = 'POP_FROM_STACK'
const DELETE_FILE = 'DELETE_FILE'

let initialState = {
  files: [],
  currentDir: null,
  dirStack: []
};

const fileReducer = (state = initialState, action) => {
  switch (action.type) {

    case SET_FILES:
      return {...state, files: action.payload}
    
    case SET_CURRENT_DIR:
      return {...state, currentDir: action.payload} 

    case ADD_FILE:
      return {...state, files: [...state.files , action.payload]} 

    case PUSH_TO_STACK:
      return {...state , dirStack: [...state.dirStack , action.payload]}     
      
    case POP_FROM_STACK:
      return {...state , dirStack: [...state.dirStack , action.payload]}    
      
    case DELETE_FILE:
      return {...state , files: [...state.files.filter((file) => file._id != action.payload)]} 

    default:
      return state;
  }
};

export const setFiles = (files) => ({
  type: SET_FILES,
  payload: files,
});

export const addFile = (file) => ({
  type: ADD_FILE,
  payload: file,
});

export const setCurrentDir = (dir) => ({
  type: SET_CURRENT_DIR,
  payload: dir,
});

export const pushToStack = (dir) => ({
  type: PUSH_TO_STACK,
  payload: dir,
});

export const deleteFile = (dirId) => ({
  type: DELETE_FILE,
  payload: dirId,
});

//--------------------------- files (Get) 
export const filesThunk = (dirId, sort) => {
  return async (dispach) => {
    try { 
      let url
      if(dirId){
        url = `?parent=${dirId}`
      }  
      if(sort){
        url = `?sort=${sort}`
      }
      if(dirId && sort){
        url = `?parent=${dirId}&?sort=${sort}`
      }
      const response = await filesAPI.getFiles(url)
      dispach(setFiles(response.data.files))
    } catch (e) {
      debugger
      alert(e.response.data.message)
    }
  }
};

//--------------------------- files (Post) 
export const createDirThunk = (dirId, name) => {
  return async (dispach) => {
    try { 
      const response = await filesAPI.createDir(dirId, name)
      dispach(addFile(response.data))
    } catch (e) {
      debugger
      alert(e.response.data.message)
    }
  }
};
//--------------------------- upload files (Get) 
export const uploadFileThunk = (file, dirId) => {
  return async (dispach) => {
    try { 
      const formData = new FormData()
      formData.append('file', file)
      if(dirId){
        formData.append('parent', dirId)
      }
      const uploadFile = {name: file.name, progress: 0, id: Date.now()}
      dispach(showUploader())
      dispach(addUploadFile(uploadFile))

      const response = await axios.post(`/api/files/upload`, formData, {
        baseURL: "http://localhost:3000/",
        headers: {
        'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin" : "*"
        },
        onUploadProgress: progressEvent => {
          const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
          console.log('total', totalLength)
          if (totalLength) {
              uploadFile.progress = Math.round((progressEvent.loaded * 100) / totalLength)
              dispach(changeUploadFile(uploadFile))
          }
        }
      }); 
      dispach(addFile(response.data))
    } catch (e) {
      debugger
      alert(e.response.data.message)
    }
  }
};

//--------------------------- download files (Post) 
export const downloadFileThunk = (file) => {
  return async (dispach) => {
    try { 

      let axiosConfigDownloadFile = {
        headers: {
        'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
        }
      }
      const response = await fetch(`http://localhost:3000/api/files/download?id=${file._id}`, axiosConfigDownloadFile)
      if(response.status === 200){
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        link.remove()
      }
    } catch (e) {
      debugger
      alert(e.response.data.message)
    }
  }
};

//--------------------------- delete files (Delete) 
export const deleteFileThunk = (file) => {
  return async (dispach) => {
    try { 
      const response = await filesAPI.deleteFiles(file)
      dispach(deleteFile(file._id))
      alert(response.data.message)
    } catch (e) {
      debugger
      alert(e.response.data.message)
    }
  }
};

//--------------------------- search files (Get) 
export const searchFileThunk = (search) => {
  return async (dispach) => {
    try { 
      const response = await filesAPI.searchFiles(search)
      dispach(setFiles(response.data))

    } catch (e) {
      debugger
      alert(e.response.data.message)
    }
  }
};

export default fileReducer;