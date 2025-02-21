import axios from "axios";
import Cookies from "js-cookie";
import { deleteAllCookies } from "../utils/cookies";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.withCredentials = true;

function unAuthorizedResponse() {
  deleteAllCookies();
  window.location.pathname = "/";
}

export function getCall(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(url);
      return resolve(response.data);
    } catch (err) {
      const { status } = err.response;
      if (status === 401) return unAuthorizedResponse();
      return reject(err);
    }
  });
}

export function postCall(url, params) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(url, params);
      return resolve(response.data);
    } catch (err) {
      if (url === "/api/v1/auth/login") {
        return reject(err);
      }
      if(err.response){
        const {status} = err.response;
        if (status === 401) return unAuthorizedResponse();
      }
      return reject(err);
    }
  });
}

export function postMediaCall(url, params) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(url, params, {
        headers: { ...({"Content-Type": "multipart/form-data" }) },
      });
      return resolve(response.data);
    } catch (err) {
      const { status } = err.response;
      if (url === "/api/v1/auth/login") {
        return reject(err);
      }
      if (status === 401) return unAuthorizedResponse();
      return reject(err);
    }
  });
}

export function putCall(url, params) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.put(url, params );
      return resolve(response.data);
    } catch (err) {
      const { status } = err.response;
      if (status === 401) return unAuthorizedResponse();
      return reject(err);
    }
  });
}

export function deleteCall(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.delete(url);
      return resolve(response.data);
    } catch (err) {
      const { status } = err.response;
      if (status === 401) return unAuthorizedResponse();
      return reject(err);
    }
  });
}

export function makeCancelable(promise) {
  let isCanceled = false;
  const wrappedPromise = new Promise((resolve, reject) => {
    // Suppress resolution and rejection if canceled
    promise.then((val) => !isCanceled && resolve(val)).catch((error) => !isCanceled && reject(error));
  });
  return {
    promise: wrappedPromise,
    cancel() {
      isCanceled = true;
    },
  };
}
