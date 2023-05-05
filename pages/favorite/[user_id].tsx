import UserData from "@/interfaces/user";
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect , useState } from "react";
import { BsFillBookmarkFill , BsBookmark } from 'react-icons/bs';
import prisma from '@/lib/prisma';
import { Favorite } from "@prisma/client";


export default function MyFavoriteUsers ({ favoriteUsers }: Props) {
  
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
                </div>
                <div className="py-5">
                    <h2 className="text-lg  mb-4"><b>My Favorite Users:</b></h2>

                    <div className="mb-4">
                
                        {favoriteUsers.map((user) => (
                            
                            <div className="bg-blue-500 rounded p-4 mb-2">
                                    <div className="grid grid-cols-2">
                                        <div>
                                            <h4 className="text-2xl mb-4 text-white">{user.name}</h4>

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
                                        
                                        
                                        
                                        </div>
                                        
                                    

                                    </div>
                            </div>
                            
                            
                            ))} 
                            
                    
                    </div>
                
                    
                </div>
            </main>
        </>
    ) 
}

type Props = {
    favoriteUsers: UserData[]
}

export async function getServerSideProps(context: GetServerSidePropsContext) {

    //favorite data
    const { user_id } = context.query
    const favoriteData = await prisma.favorite.findFirst({where:{ user_id: user_id?.toString() },});

    //user data
    let userList = [] as UserData[]
    var favoriteUserData : UserData[] = [];//result

    try {
        //rest api
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        
        //sort name by alphabet
        userList = data as UserData[]
        
        
        if(favoriteData){
            const favUserIds = favoriteData.user_like_ids;
            if(favUserIds && favUserIds.length > 0){
                var arUserIds =favUserIds.split("_");
                favoriteUserData = userList.filter(user => {
                    return (arUserIds.indexOf(user.id.toString()) > -1);
                });
            }
        }
    
    } catch (error) {
        console.error(error);
    }

    return {
        props: {
            favoriteUsers: favoriteUserData,
        }
    }; 
}
