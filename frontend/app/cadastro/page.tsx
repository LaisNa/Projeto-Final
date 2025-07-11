"use client"
import { useSysGlobalsContextProvider } from "../contextos/SysGlobalsContextProvider";
import { useRouter } from "next/navigation";
import Cadastro from "./components/Cadastro";

/* Verificação de login para renderização do Cadastro */
export default function Page() {
    const { isLoggedIn } = useSysGlobalsContextProvider();
    const router = useRouter();

    return (
        <>
            {isLoggedIn ? router.push('/catalogo') : <Cadastro />}
        </>
    )
}