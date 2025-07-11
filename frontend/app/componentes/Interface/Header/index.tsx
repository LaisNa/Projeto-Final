'use client'

import { useState } from "react";
import toast from "react-hot-toast";
import { useSysGlobalsContextProvider } from "../../../contextos/SysGlobalsContextProvider";
import { getJwtToken, removeJwtToken } from "@/app/libs/auth";
import { api } from "@/app/service/api";
import { redirect, useRouter } from 'next/navigation'
import { Menubar } from 'primereact/menubar';

const Header = () => {
    const { isLoggedIn, userInfo, loadingUserInfo } = useSysGlobalsContextProvider();
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter();

    const handleLogout = async () => {
        setIsLoading(true)
        const token = getJwtToken();
        if (token) {
            const formData = { 'token': token }
            removeJwtToken()

            try {
                await api.post('logout', formData);
                removeJwtToken()
                toast.success('Logout com sucesso!')
            } catch (error: any) {
                toast.error(error.response.data, { position: 'top-right' });
            }
            setTimeout(() => {
                setIsLoading(false)
                location.replace('/')
            }, 500);
        } else {
            setIsLoading(false)
            toast.error('Não tem token', { position: 'top-right' });
        }
    }


    const items = [
        {
            label: 'Início',
            icon: 'pi pi-home',
            command: () => {
                router.push('/')
            }
        },
    ];

    if (isLoggedIn) {
        items.push(
            {
                label: 'Sair',
                icon: 'pi pi-sign-out',
                command: () => {
                    handleLogout()
                }
            },
        )
    }

    const onInicio = () => {
        router.push('/')
    }

    const start = <img src="/indieBoxd2.png" rel="preload" className='cursor-pointer' onClick={onInicio} width={200} height={49} alt="Logo" />;

    return (
        <header className="cabecalho shadow-4">
            <div className='container-portal'>
                <Menubar className='border-none flex justify-content-between' model={items} start={start} />
            </div>
        </header>
    )
}

export default Header;