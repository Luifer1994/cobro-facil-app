import axios from "axios";

function getSubdomain() {
  const hostname = location.hostname;
  const domainParts = hostname.split(".");

  return domainParts;
}

const subdomains = getSubdomain();
let apiDomain =
  subdomains.length > import.meta.env.VITE_LENGTH_DOMAIN
    ? subdomains[0] + "." + import.meta.env.VITE_URL_API + "/api/tenant/"
    : import.meta.env.VITE_URL_API + "/api/";

apiDomain = import.meta.env.VITE_HTTP + "://" + apiDomain;

const axiosHttp = axios.create({
  baseURL: apiDomain,
});

axiosHttp.interceptors.request.use(
  (config) => {
    const currentUser = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : "";
    if (currentUser) {
      config.headers["Authorization"] = `Bearer ${currentUser}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error.response || error.message);
  }
);

axiosHttp.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      error.response.status !== 403 &&
      error.response.status !== 401 &&
      error.response.status !== 500
    ) {
      /*  const responseData = error.response.data; */
    }

    if (error.response && error.response.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("userLoggedIn");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userLoggedIn");

      if (window.location.pathname !== "/login") {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } else {
      return Promise.reject(error.response || error.message);
    }
  }
);

export default axiosHttp;
