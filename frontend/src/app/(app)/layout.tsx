import Navbar from '@/components/custom/navbar'
import React from 'react'

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <Navbar />
            {children}
        </>
    )
}
