import Head from 'next/head'
import UserData from "@/interfaces/user";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { BiLogOut  } from 'react-icons/bi';





export default function UserList({ users}:Props) {

  const [authUser, setAuthUser] = useState({} as UserData);

  const reLogin = () => {
    //Log out and Login Again

    const randomNumber = Math.floor(Math.random() * users.length);
    const user = users[randomNumber];

    //update authorized user
    setAuthUser(user);

    //local storage
    localStorage.setItem('auth_user', JSON.stringify(user));
    

  }
  useEffect(() => {

    //get authorized user from local storage
    const strStorage = localStorage.getItem('auth_user');
    const jsonStorage = JSON.parse(strStorage as string);
    
    if (!jsonStorage) {
      const randomNumber = Math.floor(Math.random() * users.length);
      const user = users[randomNumber];

      //update authorized user
      setAuthUser(user);

      //local storage
      localStorage.setItem('auth_user', JSON.stringify(user));

    }else{
      //update authorized user

      setAuthUser(jsonStorage as UserData);
    }
    
  },[]);

  return (
<>    
    <Head>
        <title>Web App Demo</title>
    </Head>
    <main className="mt-5 mx-5">
        <h1 className="text-xl font-medium mb-4 text-blue-500">Hello, I am {authUser.name} &nbsp; 
          <button className="text-red-700 text-sm" onClick={reLogin}><BiLogOut /></button>
        </h1>
        <h2 className="text-lg  mb-4"><b>All Users:</b></h2>
        <div className="mb-4">
          <ul>
              {users.map((user) => (
                <li key={user.id} className="mb-2">
                  <Link href={`/detail/${user.id}`}>
                    <b>{user.name}</b>
                    <br />Username: {user.username}, id: {user.id}
                    <br />Email: {user.email}
                    <br />Phone Number: {user.phone}
                  </Link>
                </li>
                ))} 
                
            </ul>
        </div>
    </main>
</>
) }


type Props = {
  users: UserData[],

}
export async function getStaticProps() {

  let userList = [] as UserData[]
  let currentUserData = {} as UserData

  try {
    //rest api
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await response.json();
    
    //sort name by alphabet
    userList = data as UserData[]
    userList.sort((a, b) => a.name.localeCompare(b.name));

  
  } catch (error) {
    console.error(error);
  }

  

  return {
    props: {
      users: userList, 
      authUser: currentUserData,
    },
  };

}
