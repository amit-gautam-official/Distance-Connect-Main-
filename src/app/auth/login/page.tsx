import LoginForm from "@/components/auth/forms/login-form"
import { getUserById } from "@/data/user"
import { auth } from "@/server/auth"
import { redirect } from "next/navigation"

const SignInPage = async () => {
  const session = await auth()

  if (session?.user) {
    const dbUser = await getUserById(session.user.id)

    if (dbUser?.isRegistered) {
      // Redirect based on user role
      if (dbUser?.role === "MENTOR") {
        return redirect("/mentor-dashboard")
      } else if (dbUser?.role === "STUDENT") {
        return redirect("/student-dashboard")
      }
    } else {
      return redirect("/register")
    }
  }

  return (
    <div className="w-full flex justify-center items-center px-10 sm:px-0">
      <LoginForm />
    </div>
  )
}

export default SignInPage
