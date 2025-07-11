"use client"
import { useEffect, useState } from "react";
import { useMountEffect } from "primereact/hooks";
import toast from "react-hot-toast";
import { api } from "@/app/service/api";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { useSysGlobalsContextProvider } from "@/app/contextos/SysGlobalsContextProvider";
import { redirect } from "next/navigation";
import { LoaderBox } from "@/app/componentes/LoaderBox";

type JogoProps = {
    jogoSlug: string;
}

export default function Jogo({ jogoSlug }: JogoProps) {
    const { userInfo, loadingUserInfo } = useSysGlobalsContextProvider();

    const [dados, setDados] = useState<any>();
    const [reviewId, setReviewId] = useState<number>();
    const [reviews, setReviews] = useState<any>();
    const [loadingPost, setLoadingPost] = useState<boolean>();

    const [descricao, setDescricao] = useState<string>();
    const [nota, setNota] = useState<number | null>();

    useMountEffect(() => {
        fetch(`https://api.rawg.io/api/games/${jogoSlug}?key=24fdc37148394ce1b7ca632158b663bc&`) // Substitua pela URL da sua API externa
            .then((res) => {
                if (!res.ok) throw new Error('Erro ao buscar dados');
                return res.json();
            })
            .then((data) => {
                setDados(data);
            })
            .catch((err) => {
                toast.error('Puxou nada', { position: 'top-right' });
            });
    });

    useEffect(() => {
        if (dados) {
            getReviews(dados)
            getReviewUser(dados)
        }
    }, [dados]);

    async function getReviewUser(dados: any) {
        try {
            const res: any = await api.get(`reviews-user?userId=${userInfo?.id}&gameId=${dados.id}`);
            if (res.data.length) {
                setReviewId(res.data[0].id)
                setNota(res.data[0].nota)
                setDescricao(res.data[0].descricao)
            }
        } catch (error: any) {
            toast.error(`Não foi possível carregar os dados privados`, { position: 'top-right' });
            console.log(error)
        }
    }

    async function getReviews(dados: any) {
        try {
            const res = await api.get(`reviews-game/${dados.id}`);
            setReviews(res.data)
        } catch (error: any) {
            toast.error(`Não foi possível carregar os dados privados`, { position: 'top-right' });
            console.log(error)
        }
    }

    async function handleSubmit() {
        if (nota == null) {
            toast.error('Campo "Nota" obrigatório', { position: 'top-right' });
            return
        }
        if (descricao == '') {
            toast.error('Campo "Analise" obrigatório', { position: 'top-right' });
            return
        }

        setLoadingPost(true);

        const formData = {
            nota: nota,
            descricao: descricao,
            gameId: dados.id,
            userId: userInfo?.id,
            userName: userInfo?.user,
        };

        try {
            if (reviewId) {
                const res = await api.put(`review/${reviewId}`, formData);
            } else {
                const res = await api.post('review', formData);
            }
            setLoadingPost(false);
            toast.success("Sucesso", { position: 'top-right' });
        } catch (error: any) {
            toast.error(error.response.data, { position: 'top-right' });
            setLoadingPost(false);
        }
    }

    async function handleDelete() {
        if (!reviewId) {
            toast.error('Sem análise para deletar', { position: 'top-right' });
            return
        }

        setLoadingPost(true);

        try {
            if (reviewId) {
                const res = await api.delete(`review/${reviewId}`);
            }
            setLoadingPost(false);
            toast.success("Sucesso", { position: 'top-right' });
        } catch (error: any) {
            toast.error(error.response.data, { position: 'top-right' });
            setLoadingPost(false);
        }
    }

    if (!loadingUserInfo && !userInfo) {
        toast.error("Sem login necessário", { position: 'top-right' });
        redirect('/')
    }

    return (
        <>
            {
                dados ?
                    <>
                        <h1>Jogo: {dados.name}</h1>
                        <div className="flex flex-wrap">
                            <div className="w-12 md:w-7 lg:w-9 p-3">
                                <div className="flex flex-wrap">
                                    <div className="w-full flex justify-content-center">
                                        <img src={dados.background_image_additional} alt={dados.name} height={120} className="w-full h-auto" />
                                    </div>
                                    <div className="w-full h-auto">
                                        <div className="text-justify" dangerouslySetInnerHTML={{ __html: dados.description }} />
                                    </div>
                                </div>
                                <h2>Avaliações</h2>
                                {
                                    reviews?.length ? reviews.map((r: any, i: any) => (
                                        <div key={i} className="card-custom">
                                            <div className="flex justify-content-between">
                                                <span><b>Autor:</b> {r.userName}</span>
                                                <span><b>Nota:</b> {r.nota}/10</span>
                                            </div>
                                            <p><b>Descrição:</b> {r.descricao}</p>
                                        </div>
                                    ))
                                        : "Sem avaliação até o momento"
                                }
                            </div>
                            <div className="w-12 md:w-5 lg:w-3">
                                <div className="card-custom">
                                    <h4>Minha análise</h4>
                                    <div className="mb-3">
                                        <label className="label-form">Nota</label>
                                        <InputNumber value={nota} onValueChange={(e) => setNota(e.value)} min={0} max={10} className="p-inputtext-sm w-12" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="label-form">Descrição</label>
                                        <InputTextarea value={descricao} onChange={(e) => setDescricao(e.target.value)} className="p-inputtext-sm w-12" />
                                    </div>
                                    <Button className="w-full mb-3" label="Enviar" onClick={handleSubmit} />
                                    {
                                        reviewId &&
                                        <Button label="Excluir análise" link onClick={handleDelete} />
                                    }
                                </div>
                            </div>

                        </div>
                    </>
                    : <LoaderBox />
            }
        </>
    )
}