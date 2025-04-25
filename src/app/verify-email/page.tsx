import { Suspense } from "react"
import VerifyEmailForm from "@/components/verify-email-form"

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <VerifyEmailForm />
    </Suspense>
  )
}
