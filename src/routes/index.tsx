import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className='flex flex-col gap-2 items-center'>
            <h1>Welcome to the <s>Music</s> Bingo!</h1>
            <Link to='/room' className='bg-blue-500 p-4' >Play!</Link>
        </div>
    )

}
