import prisma from '@/lib/prisma';


export default async function handle(req: any, res: any) {

    

  const { user_id, user_like_ids } = JSON.parse(req.body);

  const result = await prisma.favorite.create({
    data: {
      user_id: user_id,
      user_like_ids: user_like_ids,
    },
  });
  res.json(result);
}