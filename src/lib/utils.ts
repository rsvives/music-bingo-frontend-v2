import { twMerge } from "tailwind-merge"
import clsx from "clsx"
import superjson from 'superjson'
import type { ClassValue } from "clsx"
import type { PersistStorage } from "zustand/middleware"

export function cn(...inputs: Array<ClassValue>) {
    return twMerge(
        clsx(inputs)
    )
}

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