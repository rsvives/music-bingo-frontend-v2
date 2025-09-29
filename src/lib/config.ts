import superjson from 'superjson'
import type { PersistStorage } from "zustand/middleware"

export const LOCAL_MACHINE = import.meta.env.VITE_LOCAL_MACHINE
export const FRONTEND_URL = process.env.NODE_ENV === 'production' ? undefined : `http://${LOCAL_MACHINE}:3000`;
export const API_URL = process.env.NODE_ENV === 'production' ? undefined : `http://${LOCAL_MACHINE}:5001`;

export const createSuperjsonStorage = <T>(): PersistStorage<T> => ({
    getItem: (name) => {
        const str = localStorage.getItem(name)
        if (!str) return null
        return superjson.parse(str)
    },
    setItem: (name, value) => {
        localStorage.setItem(name, superjson.stringify(value))
    },
    removeItem: (name) => localStorage.removeItem(name),
})