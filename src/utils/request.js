import fetch from 'dva/fetch';


function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if ((response.status >= 200 && response.status < 300) || response.status == 0) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export function request(url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON);
}


export class Ajax {

  static reduceParams(param){
    if(param === null){
      return "";
    }else if (param instanceof Array) {
      // Array
      let result = [];
      for (let k = 0; k < param.length; k++) {
        let subParams = Ajax.reduceParams(param[k]);
        if(typeof subParams === 'object'){
          for(let subKey in subParams){
            result[`[${k}]${subKey}`] = subParams[subKey];
          }
        }else{
          result[`[${k}]`] = subParams;
        }
      }
      return result;
    }else if (typeof (param) === 'object'){
      // Object
      let result = [];
      for (let k in param) {
        if(typeof param[k] !== 'function') {
          let subParams = Ajax.reduceParams(param[k]);
          if(typeof subParams === 'object'){
            for(let subKey in subParams){
              if(typeof subParams[subKey] !== 'function') {
                result[`[${k}]${subKey}`] = subParams[subKey];
              }
            }
          }else {
            result[`[${k}]`] = subParams;
          }
        }
      }
      return result;
    }else{
      return param;
    }
  }

  static buildParams(params) {
    if (!params) {
      return '';
    }
    const args = Object.assign({}, params);
    const ret = [];
    for (const i in args) {
      if(typeof(args[i]) !== 'function') {
        let params = Ajax.reduceParams(args[i]);
        if (typeof params === 'object') {
          for (let key in params) {
            if(typeof(params[key]) !== 'function') {
              ret.push(`${encodeURIComponent(i)}${key}=${encodeURIComponent(params[key])}`);
            }
          }
        } else {
          ret.push(`${encodeURIComponent(i)}=${encodeURIComponent(params)}`);
        }
      }
    }
    return ret.join('&');
    // return urlEncode(args);
  }

  static post(uri, params = {}, headers = {}) {
    return request(uri, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: this.buildParams(params),
    });
  }

  static get(uri, params = {}, headers = {}) {
    const args = this.buildParams(params);
    let breakSign = '?';
    if (uri.indexOf('?') >= 0) {
      breakSign = '&';
      if (uri && uri.length && uri[uri.length - 1] === '&') {
        breakSign = '';
      }
    }
    return request(`${uri}${breakSign}${args}`, {
      credentials: 'include',
      mode: 'cors',
      headers,
    });
  }

  static delete(uri, params = {}, headers = {}) {
    return request(uri, {
      method: 'DELETE',
      credentials: 'include',
      mode: 'cors',
      headers,
      body: this.buildParams(params),
    });
  }

  static put(uri, params = {}, headers = {}) {
    return request(uri, {
      method: 'PUT',
      credentials: 'include',
      mode: 'cors',
      headers,
      body: this.buildParams(params),
    });
  }
}
