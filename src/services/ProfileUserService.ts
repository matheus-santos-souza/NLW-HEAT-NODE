import prismaClient from "../prisma";


class ProfileUserService {
   async execute (user_id: string) {
      const user = await prismaClient.user.findFirst({
         where: {
            id: user_id
         }
      })
      delete user.senha
      return user 
   }
}

export { ProfileUserService }