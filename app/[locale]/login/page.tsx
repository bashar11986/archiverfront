'use client'

import { useForm } from 'react-hook-form'
import  {apiAccount} from '@/lib/api'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type FormData = {
  // userNameOrEmailAddress: string  
  //   password: string
  //   rememberMe: true
  userName: string  
  password: string  

}

export default function LoginPage() {
  const { register, handleSubmit } = useForm<FormData>()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (data: FormData) => {
    try {
      const response = await apiAccount.post('/Login', data)
      const token = response.data.token
      localStorage.setItem('token', token)
      router.push('/[locale]/adminDashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register('userName')} type="text" placeholder="userName" className="w-full p-2 border rounded" />
        <input {...register('password')} type="password" placeholder="Password" className="w-full p-2 border rounded" />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
      </form>
    </div>
  )
}
