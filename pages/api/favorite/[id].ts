import prisma from '@/lib/prisma';

export default async function handle(req : any, res : any) {

  const favId = req.query.id;
  const { user_like_ids } = JSON.parse(req.body);

  
  const favorite = await prisma.favorite.update({
    where: { id: favId },
    data: { user_like_ids: user_like_ids },
  });
  res.json(favorite);
  
}