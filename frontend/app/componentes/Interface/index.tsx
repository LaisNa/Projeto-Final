'use client'
import Footer from "./Footer"
import Header from "./Header"

type InterfaceProps = {
    children: React.ReactNode;
    isAuth?: boolean;
}

const Interface = (props: InterfaceProps) => {
    return (<>
        <div className="tela-inteira">
            <Header />
            <main className='conteudo w-full flex-1'>
                <div className="container-portal">
                    {props.children}
                </div>
            </main>
            <Footer />
        </div>
    </>
    )
}

export default Interface;