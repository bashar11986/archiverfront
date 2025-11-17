'use client'

import { useForm } from 'react-hook-form'
import {apiAccount} from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type FormData = {
  username: string
  password: string
  email: string
  phoneNumber: string
}

export default function RegisterPage() {
  const { register, handleSubmit } = useForm<FormData>()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (data: FormData) => {
    try {
      await apiAccount.post('/NewUser', data)
      router.push('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register('username')} type="text" placeholder="Username" className="w-full p-2 border rounded" />
        <input {...register('email')} type="email" placeholder="Email" className="w-full p-2 border rounded" />
        <input {...register('password')} type="password" placeholder="Password" className="w-full p-2 border rounded" />
        <input {...register('phoneNumber')} type="text" placeholder="phoneNumber" className="w-full p-2 border rounded" />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Register</button>
      </form>
    </div>
  )
}
