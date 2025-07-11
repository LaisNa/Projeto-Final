import { Request, Response } from 'express';
import { getToken } from '../lib/jwt';
import ConexaoBD from '../lib/conexao-bd';

const tokenDBFile = 'tokens-db.json';

export const verifyToken = async (req: Request, res: Response, next: any) => {
    if (!req.headers.authorization) {
        return res.status(401).json('Token não encontrado na requisição')
    }

    const token = getToken(req)
    if (!token) {
        return res.status(401).json('Token inválido')
    }

    try {
        try {
            const tokenDB = await ConexaoBD.retornaBD(tokenDBFile);
            tokenDB.sort((a, b) => b.id - a.id);

            const tokenAtivo = tokenDB.find(t => t.token === token);

            // const tokenAtivo: any = { status: true };
            if (!tokenAtivo) {
                return res.status(401).json('Token inválido')
            } else {
                next()
            }
        } catch (error) {
            return res.status(500).json('Erro ao verificar o token')
        }
    } catch (error) {
        return res.status(401).json('Token inválido')
    }
}