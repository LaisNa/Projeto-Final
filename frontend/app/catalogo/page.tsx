"use client"
import { useSysGlobalsContextProvider } from "../contextos/SysGlobalsContextProvider";
import Catalogo from "./components/Catalogo";
import { useRouter } from "next/navigation";

/* Verificação de login para renderização do Catálogo de Jogos */
export default function Page() {
    const { isLoggedIn, userInfo, loadingUserInfo } = useSysGlobalsContextProvider();
    const router = useRouter();

    return (
        <>
            {isLoggedIn ? <Catalogo /> : router.push('/login')}
        </>
    )
}