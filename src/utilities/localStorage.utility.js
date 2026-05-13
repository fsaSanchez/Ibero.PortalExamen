export const persistLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify({ ...value }));
};

export const persistLocalStorageGeneral = (key, value) => {
    localStorage.setItem(key, value);
};

export const clearLocalStorage = (key) => {
    localStorage.removeItem(key);
};

export const getInLocalStorage = (key) => {
    const result = localStorage.getItem(key);
    return result ? JSON.parse(result) : null;
};

export const getInLocalStorageGeneral = (key) => {
    const result = localStorage.getItem(key);
    return result ? result : null;
};

// Claves de LocalStorage
export const LocalStorageKeys = {
    REFRESH_TOKEN: "refreshToken",
    TOKEN: "token",
    TOKEN_EXP_DATE: "token-exp-date",
    TOKEN_REFRESH_EXP_DATE: "refreshToken-exp-date",
};
