export const localSave = (key, value) => window.localStorage.setItem(key, value);

export const localGet = (key) => window.localStorage.getItem(key);

export const localRemove = (key) => window.localStorage.removeItem(key);