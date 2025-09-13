import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createSuperjsonStorage } from '@/lib/utils';

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

            resetNumbersStore: () => { set(store.getInitialState()) }
        }), {
        name: 'flabingo-numbers-storage', // name of the item in the storage (must be unique)
        storage,
    }
    )
)