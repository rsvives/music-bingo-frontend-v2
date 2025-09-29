import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createSuperjsonStorage } from '@/lib/config';

type State = {
    lastCalledNumber: number | null,
    calledNumbers: Set<number>,
    myMarkedNumbers: Set<number>,
    myBingoNumbers: [Array<number>, Array<number>, Array<number>]
}
type Actions = {

    setLastCalledNumber: (number: number) => void
    addCalledNumber: (number: number) => Set<number>,
    setCalledNumbers: (numberSet: Set<number>) => Set<number>,
    addMarkedNumber: (number: number) => Set<number>,
    setMarkedNumbers: (markedSet: Set<number>) => void,
    setMyBingoNumbers: (numbers: [Array<number>, Array<number>, Array<number>]) => void,
    checkLine: () => boolean,
    checkBingo: () => boolean,
    resetNumbersStore: () => void
}

const storage = createSuperjsonStorage<State & Actions>()


export const useNumbersStore = create<State & Actions>()(
    persist(
        (set, get, store) => ({
            lastCalledNumber: null,
            calledNumbers: new Set(),
            myMarkedNumbers: new Set(),
            myBingoNumbers: [[], [], []],

            setLastCalledNumber: (number) => { set({ lastCalledNumber: number }) },
            addCalledNumber: (number) => {
                const updatedCalledNumbers = get().calledNumbers
                updatedCalledNumbers.add(number)
                set({
                    calledNumbers: updatedCalledNumbers
                })
                return updatedCalledNumbers
            },
            setCalledNumbers: (numberSet) => {
                const updatedCalledNumbers = get().calledNumbers
                numberSet.forEach(number => updatedCalledNumbers.add(number)) // union() is still too new
                set({ calledNumbers: updatedCalledNumbers })
                return updatedCalledNumbers
            },
            setMarkedNumbers: (markedNumbersSet) => {
                set({ myMarkedNumbers: markedNumbersSet })
            },
            addMarkedNumber: (number) => {
                const updatedMarkedNumbers = get().myMarkedNumbers
                updatedMarkedNumbers.add(number)
                set({
                    myMarkedNumbers: updatedMarkedNumbers
                })
                return updatedMarkedNumbers
            },
            setMyBingoNumbers: (numbers) => { set({ myBingoNumbers: numbers }) },

            checkLine: () => {
                return get().myBingoNumbers.some((cardRow) => cardRow.every(n => get().myMarkedNumbers.has(n)));
            },
            checkBingo: () => {
                return get().myBingoNumbers.every((cardRow) => cardRow.every(n => get().myMarkedNumbers.has(n)));
            },

            resetNumbersStore: () => {
                set({
                    lastCalledNumber: null,
                    calledNumbers: new Set(),
                    myMarkedNumbers: new Set(),
                    myBingoNumbers: [[], [], []],
                })
            }
        }), {
        name: 'flabingo-numbers-storage', // name of the item in the storage (must be unique)
        storage,
    }
    )
)