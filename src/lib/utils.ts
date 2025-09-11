import { twMerge } from "tailwind-merge"
import clsx from "clsx"
import type { ClassValue } from "clsx"
import { useGameStore } from "@/store/useGameStore"

export function cn(...inputs: Array<ClassValue>) {
    return twMerge(
        clsx(inputs)
    )
}

export const checkLine = () => useGameStore.getState().myNumbers.some((cardRow) => cardRow.every(n => useGameStore.getState().myMarkedNumbers.has(n)))

export const checkBingo = () => useGameStore.getState().myNumbers.every((cardRow) => cardRow.every(n => useGameStore.getState().myMarkedNumbers.has(n)))