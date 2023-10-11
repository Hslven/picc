/**
 * window.localStorage 浏览器永久缓存
 */
export const localStorage = {
  // 设置永久缓存
  set(key: string, val: any) {
    if(typeof val==='object'){
      window.localStorage.setItem(key, JSON.stringify(val));
    }else {
      window.localStorage.setItem(key, val);
    }
  },
  // 获取永久缓存
  get(key: string) {
    const val: string|null = window.localStorage.getItem(key);
    if(val){
      try {
        const obj = JSON.parse(val);
        if(typeof obj == 'object' && obj ){
          return obj;
        }
      } catch(e) {
        return val;
      }
    }
  },
  // 移除永久缓存
  remove(key: string) {
    window.localStorage.removeItem(key);
  },
  // 移除全部永久缓存
  clear() {
    window.localStorage.clear();
  }
};

/**
 * window.sessionStorage 浏览器临时缓存
 */
export const sessionStorage = {
  // 设置临时缓存
  set(key: string, val: any) {
    if(typeof val==='object'){
      window.sessionStorage.setItem(key, JSON.stringify(val));
    }else {
      window.sessionStorage.setItem(key, val);
    }
  },
  // 获取临时缓存
  get(key: string) {
    const val: string|null = window.sessionStorage.getItem(key);
    if(val){
      try {
        const obj = JSON.parse(val);
        if(typeof obj == 'object' && obj ){
          return obj;
        }
      } catch(e) {
        return val;
      }
    }
  },
  // 移除临时缓存
  remove(key: string) {
    window.sessionStorage.removeItem(key);
  },
  // 移除全部临时缓存
  clear() {
    window.sessionStorage.clear();
  }
};
