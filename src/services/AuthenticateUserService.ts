import prismaClient from "../prisma"
import { sign } from "jsonwebtoken"
import crypto from "crypto";
interface IAccessTokenResponse {
    access_token: string
}
interface IUserResponse {
    id: string,
    nome: string,
    cpf: string,
    senha: string
}
class AuthenticateUserService {
    async execute(body: IUserResponse) {
        const { nome, cpf, senha } = body
        const senhaCriptografada = this.criptografar(senha)

        let user: IUserResponse = await prismaClient.user.findFirst({
            where: {
                cpf: cpf,
                senha: senhaCriptografada
            }
        })
  
        if (!user) {
            user = await prismaClient.user.create({
                data: {
                    nome: nome,
                    cpf,
                    senha: senhaCriptografada
                }
            })
        }

        const token = sign(
            {
                user: {
                    nome: user.nome,
                    cpf: user.cpf,
                    id: user.id
                }
            },
            process.env.JWT_SECRET,
            {
                subject: user.id,
                expiresIn: "1d"
            }
        )
    
        delete user.senha
        return { 
            token, 
            user
        } 
    }

    
    
    criptografar(senha) {
        const DADOS_CRIPTOGRAFAR = {
            algoritmo : "aes256",
            segredo : "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            tipo : "hex"
        };
        const cipher = crypto.createCipher(DADOS_CRIPTOGRAFAR.algoritmo, DADOS_CRIPTOGRAFAR.segredo);
        cipher.update(senha);
        return cipher.final("hex");
    };

}

export { AuthenticateUserService }