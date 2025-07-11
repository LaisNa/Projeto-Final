import express, { Request, Response } from 'express';
import { hash, verify } from '../lib/crypt';
import { generateAccessToken } from '../lib/jwt';
import ConexaoBD from '../lib/conexao-bd';
const router = express.Router();

const userDBFile = 'usuarios-db.json';
const tokenDBFile = 'tokens-db.json';

router.post('/cadastro', async (req: Request, res: Response) => {
    const { email, user, password } = req.body
    if (email && user && password) {
        const passwordCrypt = await hash(password);

        try {
            const users = await ConexaoBD.retornaBD(userDBFile);
            const maiorId = Math.max(...users.map(user => user.id));

            for (const user of users) {
                if (user.email === email) {
                    return res.status(401).json('Email já cadastrado')
                }
            }

            const novoUser = {
                id: maiorId + 1,
                user,
                email,
                password: passwordCrypt
            }

            users.push(novoUser);
            ConexaoBD.armazenaBD(userDBFile, users);

            return res.status(200).json('Cadastrado com sucesso!')
        } catch (error) {
            return res.status(500).json(error)
        }
    } else {
        return res.status(401).json('Formulário incompleto')
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const { user, password } = req.body
    if (user && password) {
        try {
            const usuariosDB = await ConexaoBD.retornaBD(userDBFile);

            const userDados = usuariosDB.find(u => u.user === user);

            if (userDados) {
                const checkPassword = await verify(password, userDados.password)
                if (!checkPassword) return res.status(401).json('Senha incorreta')

                const accessToken = generateAccessToken(userDados);

                const tokensDados = await ConexaoBD.retornaBD(tokenDBFile);
                const maiorId = Math.max(...tokensDados.map(token => token.id));

                // Salvar os token
                // Verificar se existem tokens ativos
                // se existir tokens ativos, ignora e passa
                const novoToken = {
                    id: maiorId + 1,
                    token: accessToken,
                    userId: userDados.id,
                    status: true,
                    created_at: new Date()
                }

                tokensDados.push(novoToken);
                ConexaoBD.armazenaBD(tokenDBFile, tokensDados);

                return res.status(200).json({ accessToken: accessToken });
            } else {
                return res.status(401).json('Usuário não cadastrado');
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    } else {
        return res.status(401).json('Formulário incompleto')
    }
});

export default router;
