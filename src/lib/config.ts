export const LOCAL_MACHINE = import.meta.env.VITE_LOCAL_MACHINE
export const FRONTEND_URL = process.env.NODE_ENV === 'production' ? undefined : `http://${LOCAL_MACHINE}:3000`;
export const API_URL = process.env.NODE_ENV === 'production' ? undefined : `http://${LOCAL_MACHINE}:5001`;


