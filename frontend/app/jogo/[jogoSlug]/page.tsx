"use client"
import { useRouter } from "next/navigation";
import Jogo from "./components/Jogo";
import { useSysGlobalsContextProvider } from "@/app/contextos/SysGlobalsContextProvider";

/* Verificação de login para renderização do Jogo */
export default function Page({ params }: { params: { jogoSlug: string } }) {
    const { isLoggedIn } = useSysGlobalsContextProvider();
    const router = useRouter();

    return (
        <>
            {isLoggedIn ? <Jogo jogoSlug={params.jogoSlug} /> : router.push('/login')}
        </>
    )
}