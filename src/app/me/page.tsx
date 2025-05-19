import { auth } from '@/server/auth'
import React from 'react'

const page = async () => {
    const session = await auth()
  return (
    <div>
        session = {JSON.stringify(session)}
    </div>
  )
}

export default page