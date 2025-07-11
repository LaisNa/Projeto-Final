'use client'
import { useState } from "react";
import toast from "react-hot-toast";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { api } from "@/app/service/api";
import { useRouter } from "next/navigation";

export default function Cadastro() {
    const router = useRouter()

    const [loadingPost, setLoadingPost] = useState(false)
    const [email, setEmail] = useState('')
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    async function handleSubmt() {
        if (email == '') {
            return toast.error('Campo "E-mail" obrigatório', { position: 'top-right' });
        }

        const isEmail = email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/);
        if (!isEmail) {
            return toast.error('Campo de email é inválido', { position: 'top-right' });
        }

        if (user == '') {
            return toast.error('Campo "Usuário" obrigatório', { position: 'top-right' });
        }

        if (password == '') {
            return toast.error('Campo "Senha" obrigatório', { position: 'top-right' });
        }
        if (password.length < 4) {
            return toast.error('Campo "Senha" deve ser maior de 4 caracteres', { position: 'top-right' });
        }
        if (confirmPassword != password) {
            return toast.error('As senhas não correspondem', { position: 'top-right' });
        }

        setLoadingPost(true)

        const formData = {
            'email': email,
            'user': user,
            'password': password
        }

        try {
            const res = await api.post('cadastro', formData)
            setLoadingPost(false)
            toast.success("Cadastrado com sucesso", { position: 'top-right' })
            router.push('/')
        } catch (error: any) {
            toast.error(error.response.data, { position: 'top-right' })
            setLoadingPost(false)
        }
    }

    return (
        <>
            <div className="flex justify-content-center">
                <div className="card-custom w-4">
                    <h2><b>NOVA CONTA</b></h2>
                    <div className="mb-3">
                        <label className="label-form">E-mail</label>
                        <InputText className="p-inputtext-sm w-12" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="label-form">Usuário</label>
                        <InputText className="p-inputtext-sm w-12" value={user} onChange={(e) => setUser(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="label-form">Senha</label>
                        <Password className="p-inputtext-sm w-12" value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} tabIndex={0} />
                    </div>
                    <div className="mb-3">
                        <label className="label-form">Confirmar senha</label>
                        <Password className="p-inputtext-sm w-12" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} feedback={false} tabIndex={0} />
                    </div>
                    {loadingPost ?
                        <Button label="Carregando..." icon="pi pi-check" disabled />
                        :
                        <Button label="Cadastrar" icon="pi pi-check" onClick={handleSubmt} />
                    }
                </div>
            </div>
        </>
    )
}