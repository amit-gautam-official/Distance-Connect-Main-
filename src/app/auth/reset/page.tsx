import LoginForm from "@/components/auth/forms/login-form";
import ResetForm from "@/components/auth/forms/reset-form";

import { auth } from "@/server/auth";
import { SessionUser } from "@/types/sessionUser";
import { redirect } from "next/navigation";

const ResetPage = async () => {
  const session = await auth();
  const user = session?.user as SessionUser | undefined;

  if (user) {
    if (user?.isRegistered) {
      if (user?.role === "MENTOR") {
        return redirect("/mentor-dashboard");
      }
      if (user?.role === "STUDENT") {
        return redirect("/student-dashboard");
      }
    }
    if (!user?.isRegistered) {
      redirect("/register");
    }
  }

  return (
    <div className="flex w-full items-center justify-center px-10 sm:px-0">
      <ResetForm />
    </div>
  );
};

export default ResetPage;
