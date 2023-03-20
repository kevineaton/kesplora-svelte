import axios from "axios";

/**
 * The main method for calling the API. Note that we currently use axios. A feature-matched conversion to fetch or ky
 * could be an interesting change if needed.
 * @param method one of get, put, patch, post, delete
 * @param endpoint the endpoint of the server to hit, such as users/login
 * @param data  the data ti attach to the call
 * @param options additional options, such as headers
 */
export function makeCall(method: string, endpoint: string, data: any = {}, options: any = {}): Promise<any> {
  const url = makeUrl(endpoint);

  const meth = method.toLowerCase();
  const config: any = {
    method: meth,
    url,
    timeout: 15000,
    headers: {},
    params: {},
    data: {},
    withCredentials: true,
  };
  
  if(options.asMultipartFile){
    const formData = new FormData();
    formData.append("file", data);
    config.data = formData;
  } else {
    if (meth === "get" || meth === "delete") {
      config.params = data;
    } else {
      config.data = data;
    }
  }

  if(options.accept){
    config.headers.Accept = options.accept;
  }

  if(options.etag){
    config.headers["If-None-Match"] = options.etag;
  }

  if(options.asDownload){
    config.responseType = "blob";
  }

  return axios(config)
  .then((res: any) => {
    // if they asked for a download, we have to do this One Dumb Trick
    if(options.asDownload){
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      const fileName = options.fileName ? options.fileName : "file";
      link.setAttribute('download', fileName); //or any other extension
      document.body.appendChild(link);
      link.click();
      link.remove();
      res.data = { downloaded: true};
    }
    return Promise.resolve({
      code: 200,
      body: res.data
    });
  })
  .catch((err: any) => {
    const ret = {
      code: 500,
      body: err
    };

    if(err.response && err.response.status) {
      ret.code = err.response.status;
      ret.body = err.response.data;
    }

    // we need to check for expired token here
    if(ret.code === 419 || ret.code === 401 || ret.body.error === "expired"){
      // if the location is the home or login, we don't try to refresh
      if(window.location.pathname === "/login" || window.location.pathname === "/" || window.location.pathname.includes("preferences")){
        return Promise.reject(ret);
      }
      // let's see if we can run the refresh to get a new access token
      const refreshData = {};
      const refreshConfig: any = {
        method: "POST",
        url: makeUrl(`/me/refresh`),
        timeout: 1000,
        headers: {},
        params: {},
        data: refreshData,
        withCredentials: true
      };
      return axios(refreshConfig)
      .then((res: any) => {
        return makeCall(method, endpoint, data, options);
      }).catch(() => {
        window.localStorage.clear();
        window.localStorage.setItem("expired", "yes");
        window.location.href = "/login";
        Promise.reject(ret);
      });
    }
    return Promise.reject(ret);
  });
}

/**
 * A helper function to generate a url
 * @param endpoint 
 */
export function makeUrl(endpoint: string): string {
  let api = import.meta.env.VITE_API || "http://localhost:8080";
  // normalize
  if(api.charAt(api.length -1) === "/"){
    api = api.substr(0, api.length - 1);
  }
  let resource = endpoint;
  if(resource.charAt(resource.length -1) === "/"){
    resource = resource.substr(0, resource.length - 1);
  }
  if(resource.charAt(0) === "/"){
    resource = resource.substr(1, resource.length);
  }
  return `${api}/${resource}`;
}