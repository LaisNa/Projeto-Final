'use client'
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { getJwtToken, removeJwtToken } from "../libs/auth";
import toast from "react-hot-toast";
import { api } from "../service/api";

type contextProps1 = {
    children: ReactNode;
}

type UserInfoType = {
    id: number;
    user: string;
    name: string;
    email: string;
} | undefined

interface ContextProps {
    isLoggedIn: boolean;
    setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
    userInfo: UserInfoType;
    loadingUserInfo: boolean;
}

const SysGlobalsContext = createContext<ContextProps>({
    isLoggedIn: false,
    setIsLoggedIn: (): boolean => false,
    userInfo: undefined,
    loadingUserInfo: false
})


export const SysGlobalsContextProvider = ({ children }: contextProps1) => {
    const [isLoggedIn, setIsLoggedIn] = useState(Boolean(getJwtToken()))
    const [userInfo, setUserInfo] = useState(undefined)
    const [loadingUserInfo, setLoadingUserInfo] = useState(true)

    const getUserInfo = async () => {
        setLoadingUserInfo(true)

        try {
            const userInfo = await api.get('userInfo')
            if (userInfo) {
                setUserInfo(userInfo.data)
                setIsLoggedIn(true)
                setLoadingUserInfo(false)
            } else {
                setIsLoggedIn(false)
                removeJwtToken()
                setLoadingUserInfo(false)
            }
        } catch (error) {
            removeJwtToken()
            setLoadingUserInfo(false)
        }
    }

    useEffect(() => {
        // Criar verificação de token com backend
        if (isLoggedIn) {
            getUserInfo()
        } else {
            toast('Não tá logado', { position: 'top-right' });
            setLoadingUserInfo(false)
        }
    }, [isLoggedIn])

    return (
        <SysGlobalsContext.Provider value={{ isLoggedIn, setIsLoggedIn, userInfo, loadingUserInfo }}>
            {children}
        </SysGlobalsContext.Provider>
    )
}

export const useSysGlobalsContextProvider = () => useContext(SysGlobalsContext);