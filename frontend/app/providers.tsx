"use client"
import { PrimeReactProvider } from "primereact/api"
import { SysGlobalsContextProvider } from "./contextos/SysGlobalsContextProvider"

const Providers = ({ children }: any) => (
    <PrimeReactProvider>
        <SysGlobalsContextProvider>
            {children}
        </SysGlobalsContextProvider>
    </PrimeReactProvider>
)

export { Providers }