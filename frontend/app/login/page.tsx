'use client'
import React, { useState } from "react";
import toast from "react-hot-toast";
import { saveJwtToken } from "@/app/libs/auth";
import { api } from "@/app/service/api";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

export default function Login() {

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit() {

        if (login == '') {
            toast.error('Campo "Login" obrigatório', { position: 'top-right' });
            return
        }

        if (password == '') {
            toast.error('Campo "Senha" obrigatório', { position: 'top-right' });
            return
        }
        var formData = null

        formData = {
            user: login,
            password: password
        }

        setIsLoading(true)

        try {
            const loginRes = await api.post('login', formData);
            saveJwtToken(loginRes.data.accessToken)

            toast.success('Login efetuado com sucesso!', { position: 'top-right' });
            setTimeout(() => {
                location.replace('/catalogo')
            }, 1000);
            setIsLoading(false)
        } catch (error: any) {
            setIsLoading(false)
            console.log(error)
            toast.error(JSON.stringify(error.response.data), { position: 'top-right' });
        }
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="card-custom w-4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h2>LOGIN</h2>
                    <div className="mb-3">
                        <label className="label-form">Usuário</label>
                        <InputText value={login} onChange={(e) => setLogin(e.target.value)} className="p-inputtext-sm w-12" />
                    </div>
                    <div className="mb-3">
                        <label className="label-form">Senha</label>
                        <Password value={password} onChange={(e) => setPassword(e.target.value)} className="p-inputtext-sm w-12" feedback={false} />
                    </div>

                    {
                        isLoading ?
                            <Button className="w-full mb-3" label="Carregando..." disabled />
                            :
                            <Button className="w-full mb-3" label="Login" onClick={handleSubmit} />
                    }

                    <span>Não possui conta? <a href="/cadastro">Cadastre-se</a></span>
                </div>
            </div>
        </>
    )
}