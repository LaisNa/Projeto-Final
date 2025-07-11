import express, { Request, Response } from 'express';
import { verifyToken } from '../middlewares/verifyToken';
import { decodeToken, getToken } from '../lib/jwt';
import ConexaoBD from '../lib/conexao-bd';

const router = express.Router();

const tokenDBFile = 'tokens-db.json';
const reviewDBFile = 'reviews-db.json';

router.get('/userInfo', verifyToken, async (req: Request, res: Response) => {
    const token: any = getToken(req)

    const tokenDB = await ConexaoBD.retornaBD(tokenDBFile);
    tokenDB.sort((a, b) => b.id - a.id);

    const tokenAtivo = tokenDB.find(t => t.token === token).token;

    return res.json(decodeToken(tokenAtivo));
});

router.get('/reviews-game/:gameId', verifyToken, async (req: Request, res: Response) => {
    const gameId = req.params.gameId;

    const reviewsDB = await ConexaoBD.retornaBD(reviewDBFile);
    const reviews = reviewsDB.filter(t => t.gameId == gameId);

    return res.json(reviews)
});

router.get('/reviews-user', verifyToken, async (req: Request, res: Response) => {
    const { userId, gameId } = req.query;

    const reviewsDB = await ConexaoBD.retornaBD(reviewDBFile);
    const reviews = reviewsDB.filter(t => t.userId == userId && t.gameId == gameId);

    return res.json(reviews)
});

router.post('/review', verifyToken, async (req: Request, res: Response) => {
    const { nota, descricao, gameId, userId, userName } = req.body;
    console.log(userName)
    if (nota && descricao && gameId && userId && userName) {
        try {
            const reviewsDB = await ConexaoBD.retornaBD(reviewDBFile);
            const maiorId = Math.max(...reviewsDB.map(review => review.id));

            for (const review of reviewsDB) {
                if (review.userId == userId && review.gameId == gameId) {
                    return res.status(401).json('Usuario ja realizou uma review para esse jogo')
                }
            }

            const novaReview = {
                id: maiorId + 1,
                nota: nota,
                descricao: descricao,
                gameId: gameId,
                userId: userId,
                userName: userName
            }

            reviewsDB.push(novaReview);
            ConexaoBD.armazenaBD(reviewDBFile, reviewsDB);

            return res.status(200).json('Cadastrado com sucesso!')
        } catch (error) {
            return res.status(500).json(error)
        }
    } else {
        return res.status(401).json('Formulário incompleto')
    }
});

router.put('/review/:reviewId', verifyToken, async (req: Request, res: Response) => {
    const { nota, descricao, gameId, userId, userName } = req.body;
    const { reviewId } = req.params;
    if (reviewId && nota && descricao && gameId && userId && userName) {
        try {
            const reviewsDB = await ConexaoBD.retornaBD(reviewDBFile);
            const reviewIndex = reviewsDB.findIndex(
                (review) => review.userId == userId && review.gameId == gameId
            );

            if (reviewIndex === -1) {
                return res.status(404).json('Review não encontrada para esse jogo e usuário.');
            }

            // Atualiza os campos
            reviewsDB[reviewIndex].nota = nota;
            reviewsDB[reviewIndex].descricao = descricao;

            await ConexaoBD.armazenaBD(reviewDBFile, reviewsDB);

            return res.status(200).json('Review atualizada com sucesso!')
        } catch (err) {
            return res.status(500).json(err);
        }
    }
    return res.status(401).json('Formulário incompleto')
});

router.delete('/review/:reviewId', verifyToken, async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    if (reviewId) {
        try {
            const reviewsDB = await ConexaoBD.retornaBD(reviewDBFile);
            const reviewIndex = reviewsDB.findIndex(
                (review) => review.id == reviewId
            );

            if (reviewIndex === -1) {
                return res.status(404).json('Review não encontrada.');
            }

            // Remove a review do array
            reviewsDB.splice(reviewIndex, 1);

            await ConexaoBD.armazenaBD(reviewDBFile, reviewsDB);

            return res.status(200).json('Review deletada com sucesso!')
        } catch (err) {
            return res.status(500).json(err);
        }
    }
    return res.status(401).json('Formulário incompleto')
});

router.post('/logout', verifyToken, async (req: Request, res: Response) => {
    // Pegar o token no body  da requisição
    // Busca o token no banco e apaga ou desativa
    const reqToken: string = req.body.token;

    try {
        const tokenDB = await ConexaoBD.retornaBD(tokenDBFile);

        const tokenActived = tokenDB.find(
            t => t.token === reqToken
        );
        const tokenIndex = tokenDB.findIndex(
            t => t.token === reqToken
        );

        if (tokenActived) {
            // Atualiza os campos
            tokenDB[tokenIndex].status = false;
            await ConexaoBD.armazenaBD(tokenDBFile, tokenDB);
        } else {
            return res.status(401).json('Token inexistente')
        }
    } catch (error) {
        return res.status(401).json('Falha ao inativar token')
    }

    console.log('Logout!');
    return res.status(200).json('Logout!');
});

export default router;