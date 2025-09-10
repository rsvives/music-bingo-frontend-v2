import { Button } from "./ui/Button"

export const JoinLeaveButton = ({ isJoined, handleJoin }: { isJoined: boolean, handleJoin: () => void }) => {

    const text = isJoined ? 'leave' : 'join'
    return (
        <Button fill="solid" color="secondary" className="min-w-[100px] text-center justify-center" onClick={() => handleJoin()} >{text}</Button>

    )
}