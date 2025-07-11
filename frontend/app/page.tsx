'use client'
import { useRouter } from "next/navigation";
import { useSysGlobalsContextProvider } from "./contextos/SysGlobalsContextProvider";

export default function Home() {
  const { userInfo, loadingUserInfo } = useSysGlobalsContextProvider();
  const router = useRouter();

  return (
    <>
      {
        !userInfo ? router.push('/login') :
          router.push('/cadastro')
      }
    </>
  )
}