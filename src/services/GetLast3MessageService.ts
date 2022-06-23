import prismaClient from "../prisma";


class GetLast3MessageService {
   async execute () {
      const messages = await prismaClient.message.findMany({
         take: 3,
         orderBy: {
            created_at: "desc"
         },
         include: {
            user: true,
         }
      })
      messages.map(message => delete message.user.senha)
      return messages
   }
}

export { GetLast3MessageService }