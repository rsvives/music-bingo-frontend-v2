export type User = {
    id: string,
    username: string | null,
    firstName: string | null,
    lastName?: string | null
    email: string | undefined,
    pic: string
}
type PlayerId = string

export interface Player extends User {
    isAdmin?: boolean,
    socket: string | null | undefined,
    numbers: [Array<number>, Array<number>, Array<number>],
    marked: 0 // TODO: should be a set with marked numbers
}

export type PlayersMap = Record<PlayerId, PlayerData>