import UserData from "@/interfaces/user";
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect , useState } from "react";
import { BsFillBookmarkFill , BsBookmark } from 'react-icons/bs';
import prisma from '@/lib/prisma';
import { Favorite } from "@prisma/client";


export default function ({ user , userFavorites }: Props) {

    const [authUser, setAuthUser] = useState({} as UserData);
    const [isFavorite, setIsFavorite] = useState(false);

    const addToFavorite = () => {

        let newIsFavorite = !isFavorite;
        
        setIsFavorite(newIsFavorite);

        

        if(userFavorites){
            //--- update favorite ---
            
            //get array of ids of liked user
            var arUserIds: string[] = [];
            const favUserIds = userFavorites.user_like_ids;
            if(favUserIds && favUserIds.length > 0){
                arUserIds =favUserIds.split("_");
            }


            //update array of ids of liked user
            if(newIsFavorite){
                if(arUserIds.indexOf(authUser.id.toString()) <= -1){
                    arUserIds = [...arUserIds, authUser.id.toString()];
                }
                userFavorites.user_like_ids = arUserIds.join("_");

            }else{
                let idx  = arUserIds.indexOf(authUser.id.toString());
                
                if(idx > -1){
                    arUserIds = [
                        ...arUserIds.slice(0, idx),
                        ...arUserIds.slice(idx + 1)
                      ];
                }
                userFavorites.user_like_ids = arUserIds.join("_");
            }
            //update favorite
            updateFavorite(userFavorites.id,userFavorites.user_like_ids);
            

        }else{
            //create favorite
            createFavorite(user.id.toString(),authUser.id.toString());
        }
        
    }

    useEffect(() => {
        //auth user
        const strStorage = localStorage.getItem('auth_user');
        const jsonStorage = JSON.parse(strStorage as string);
        if (jsonStorage) {

            const usr = jsonStorage as UserData;
            setAuthUser(usr);

            
            if(userFavorites){
                const favUserIds = userFavorites.user_like_ids;
                //check if authorized user already liked
                if(favUserIds && favUserIds.length > 0){
                    var arUserIds =favUserIds.split("_");
                    setIsFavorite(arUserIds.indexOf(usr.id.toString()) > -1);
                }
            }

        }
        
      },[]);

      
    return (
        <> 
            <Head>
                <title>Web App Demo</title>
            </Head>
            <main className="mt-5 mx-5">
                <div className="grid grid-cols-2">
                    <div>
                        <Link href="/" className="text-sm">&larr; Home</Link>
                    </div>
                    <div className="justify-self-end">
                        <Link href={`/favorite/${authUser.id}`} className="text-sm"><BsFillBookmarkFill /></Link>
                    </div>
                </div>
                <div className="py-5">
                <h1 className="text-xl font-medium mb-4 text-blue-500">Hello, I am {authUser.name}</h1>
                <div className="bg-blue-500 rounded p-4">
                        <div className="grid grid-cols-2">
                            <div>
                                <h2 className="text-2xl mb-4 text-white">{user.name}</h2>

                                <span className="font-medium text-lg text-white">
                                    Username: {user.username}, id: {user.id}
                                </span>
                                <br/> 
                                <span className="font-medium text-lg text-white">
                                    Email: {user.email}
                                </span>
                                <br/> 
                                <span className="font-medium text-lg text-white">
                                    Phone Number: {user.phone}
                                </span>
                                <br/> 
                                <span className="font-medium text-lg text-white">
                                    Address: {user.address.street}, {user.address.suite}
                                            , {user.address.city}, {user.address.zipcode}
                                </span>
                               
                               
                            </div>
                            
                            <div className="justify-self-end">
                                <button className="text-white text-sm" onClick={addToFavorite}>{isFavorite?<BsFillBookmarkFill />:<BsBookmark />}</button>
                            </div>

                        </div>
                </div>
                </div>
            </main>
        </>
    ) 
}

type Props = {
    user: UserData,
    userFavorites: Favorite
}

export async function getServerSideProps(context: GetServerSidePropsContext) {

    const { user_id } = context.query

    let url = `https://jsonplaceholder.typicode.com/users/${user_id}`

    // Fetch the user data (with address)
    const res = await fetch(url);
    const userData: UserData = await res.json();
    if (!userData) {
        throw new Error("User data not found");
    }
    
    const favoriteData = await prisma.favorite.findFirst({where:{ user_id: user_id?.toString() },});
    
    return {
        props: {
            user: userData,
            userFavorites: favoriteData,
        }
    }; 
}

async function updateFavorite(id: string,user_like_ids: string): Promise<void> {

    const body = {"user_like_ids": user_like_ids };

    await fetch(`/api/favorite/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    
}


async function createFavorite(user_id: string,user_like_ids: string): Promise<void> {
    

    const body = { "user_id":user_id, "user_like_ids": user_like_ids };
    
    
    await fetch('/api/favorite', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    
}
