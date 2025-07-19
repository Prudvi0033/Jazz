'use client'
import React from 'react'
import { authClient } from '../lib/auth-client'

const Google = () => {
    const handleSignIn = async () => {
        const data = await authClient.signIn.social({
            provider: 'google',
            callbackURL: '/'
        })
        console.log(data);
        
    }
  return (
    <div>
        <button onClick={handleSignIn}>Google</button>

    </div>
  )
}

export default Google