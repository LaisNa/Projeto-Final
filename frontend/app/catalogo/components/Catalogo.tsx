"use client"
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoaderBox } from '@/app/componentes/LoaderBox';

export default function Catalogo() {

    const [loading, setLoading] = useState<boolean>(true);

    const [first, setFirst] = useState<number>(0);
    const [rows, setRows] = useState<number>(10);
    const [page, setPage] = useState<number>(1);

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setPage(event.page + 1);
        setFirst(event.first);
        setRows(event.rows);
    };

    const [dados, setDados] = useState<any>();

    useEffect(() => {
        buscarJogos(page)
    }, [page]);

    async function buscarJogos(page: number) {
        try {
            setLoading(true)
            const response = await fetch(`https://api.rawg.io/api/games?key=24fdc37148394ce1b7ca632158b663bc&genres=51&page=${page}`);

            if (!response.ok) {
                throw new Error('Erro ao buscar dados');
            }

            const data = await response.json();
            setDados(data);
            setLoading(false)
        } catch (error) {
            toast.error('Puxou nada', { position: 'top-right' });
        }
    }

    return (
        <>
            {
                loading ? <LoaderBox />
                    :
                    <>
                        <h1>Catálogo</h1>
                        <div className="flex flex-wrap">
                            {dados && dados.results.map((d: any, i: any) => (
                                <div key={i} className="p-3 w-3">
                                    <a href={`/jogo/${d.slug}`} className='catalogo-link'>
                                        <div className="card-custom" style={{ height: '100%' }}>
                                            <img src={d.background_image} alt={d.name} height={120} className="w-full" />
                                            <p>
                                                {d.name}
                                            </p>

                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                        <Paginator first={first} rows={rows} totalRecords={120} rowsPerPageOptions={[10, 20, 30]} onPageChange={onPageChange} />
                    </>
            }
        </>
    )
}