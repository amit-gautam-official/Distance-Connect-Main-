"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";



export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  
     const router = useRouter();
     
     const user =  api.user.getMe.useQuery();
   
     useEffect(() => {
       if (user.isError) {
         router.push("/auth/login");
       } else if (user.data && user.data.role !== "STUDENT") {
         router.push("/register");
       }
     }
     , [user.isError, user.data, router]);


  return (

          <div >
            {children}
          </div>

  );
}
