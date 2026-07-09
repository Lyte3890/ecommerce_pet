// src/config.js

const getEnvVar = (key) => {
    const value = import.meta.env[key];
    if (!value) {
        throw new Error(`CRITICAL ARCHITECTURE ERROR: Environment variable ${key} is not defined. Application cannot start.`);
    }
    return value;
};

export const API_BASE_URL = getEnvVar('VITE_API_URL');