'use client'

import { useForm } from 'react-hook-form'
import { useState } from "react";
import { apiAccount } from "@/lib/api";
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

type FormData = { 
  userName: string
  password: string
}

export default function LoginForm() {
  const { register, handleSubmit } = useForm<FormData>()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const tr = useTranslations('login');

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const response = await apiAccount.post('/Login', data)
      const token = response.data.token
      localStorage.setItem('token', token)
      router.push('/adminDashboard/users')
    } catch (err) {
      setError(err.response?.data?.message || tr("logginFaild"))
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-slate-200 shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{tr("title")}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register('userName')} type="text" placeholder={tr("placeholder.username")} className="w-full p-2 border rounded" />
       <div className="relative"> 
        <input {...register('password')}  type={showPassword ? "text" : "password"}  placeholder={tr("placeholder.password")} className="w-full p-2 border rounded" />
        <span  className={`
      absolute inset-y-0 flex items-center cursor-pointer 
      ltr:right-3 rtl:left-3
    `}          
          onClick={() => setShowPassword(!showPassword)}
        >
          {/*  get emoji from keyboard => windows + .   or windows + ;*/}
          {showPassword ? "😴" : "🫣"}  
        </span>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white p-2 rounded flex items-center justify-center"
        >

          {isLoading ? (
            <span className="animate-pulse"> {tr("logging")}</span>
          ) : (
            tr("button")
          )}

        </button>
      </form>
    </div>
  )
}
