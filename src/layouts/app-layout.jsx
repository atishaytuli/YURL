import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '@/components/header'

const AppLayout = () => {
    return (
        <>
            <main className='min-h-screen container mx-auto'>
                <Header />
                <Outlet />
            </main>

            <footer className='px-10 mb-4 flex items-center justify-between'>
            <p>
            © 2025 YURL | Handmade in India for all over the world.
            </p>
            <a href="#">LinkedIN</a>
            </footer>
        </>
    )
}

export default AppLayout