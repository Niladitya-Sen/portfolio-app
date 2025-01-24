import StocksContextProvider from '@/context/StocksContext'
import React from 'react'

export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <StocksContextProvider>
            {children}
        </StocksContextProvider>
    )
}
