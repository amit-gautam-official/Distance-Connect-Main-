import { Suspense } from "react"
import ChangePasswordForm from "@/components/ChangePasswordForm"

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="h-[100dvh] w-[100vw] flex justify-center items-center bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <ChangePasswordForm />

      </div>
    </Suspense>
  )
}
