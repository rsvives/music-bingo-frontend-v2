import { PlayerList } from "./PlayersList"

export const Aside = () => {

    return (
        <>
            <aside className='p-2 flex flex-col gap-4 sm:max-w-[280px] w-full'>
                {/* <RoomDetails /> */}
                <PlayerList />
            </aside>
        </>
    )
}

