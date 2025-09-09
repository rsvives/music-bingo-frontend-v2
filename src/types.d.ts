export type User = {
    id: string,
    username: string | null,
    firstName: string | null,
    lastName?: string | null
    email: string | undefined,
}
type PlayerId = string

export interface Player extends User {
    isAdmin?: boolean,
    socket: string | null | undefined,
    numbers: Array<number>
}

export type PlayersMap = Record<PlayerId, PlayerData>