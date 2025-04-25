import RegisterForm from '@/components/auth/forms/register-form'
import { getUserById } from '@/data/user';
import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';
import React from 'react'

const RegisterPage = async () => {

  const session = await auth();
  // console.log("Session", session)
  if(session?.user) {
    const dbUser = await getUserById(session.user.id)

    if (dbUser?.isRegistered) {
      // Redirect based on user role
      if (dbUser?.role === "MENTOR") {
        return redirect("/mentor-dashboard")
      } else if (dbUser?.role === "STUDENT") {
        return redirect("/student-dashboard")
      }
    } else {
      return redirect("/auth/login")
    }
  }


  return (
    <RegisterForm />
  )
}

export default RegisterPage