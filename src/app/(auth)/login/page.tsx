'use client'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/auth"
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react"
import Link from "next/link"
import { FormEvent, useState } from "react"
import { BottomGradient, LabelInputContainer } from "../layout"

const Login = () => {
  const { login } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')
    if (!email || !password) {
      setError('Please fill out all the fields')
      return
    }
    setLoading(true)
    setError('')
    const loginRes = await login(String(email), String(password))
    if (loginRes.error) setError(loginRes.error.message)
    setLoading(false)
  }
  return (
    <div className='mx-auto w-full max-w-md rounded-none border border-solid border-white/30 bg-white p-4 shadow-input dark:bg-black md:rounded-2xl md:p-8'>
      <h2 className='text-xl font-bold text-neutral-800 dark:text-neutral-200'>
        Login to StackFlow
      </h2>
      <p className='mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300'>
        Login to StackFlow
        <br />
        Don&apos;t have an account? <Link href='/register' className='text-orange-500 hover:underline'>Register</Link> with StackFlow
      </p>
      {error &&
        <p className='mt-8 text-center text-sm text-red-500 dark:text-red-400'>
          {error}
        </p>
      }
      <form className='my-8' onSubmit={submitHandler}>
        <LabelInputContainer className='mb-4'>
          <Label htmlFor='email'>
            Email Address
          </Label>
          <Input className='text-black' id='email' name='email' placeholder='desimailing@mail.com' type='email' />
        </LabelInputContainer>
        <LabelInputContainer className='mb-4'>
          <Label htmlFor='password'>
            Password
          </Label>
          <Input className='text-black' id='password' name='password' placeholder='*********' type='password' />
        </LabelInputContainer>
        <button type='submit' disabled={loading} className='group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]'>
          Log In &rarr;
          <BottomGradient />
        </button>
        <div className='my-8 h-px w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700' />
        <div className="flex flex-col space-y-4">
          <button className='group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black shadow-input dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]' type='button' disabled={loading}>
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Google
            </span>
            <BottomGradient />
          </button>
          <button className='group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black shadow-input dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]' type='button' disabled={loading}>
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              GitHub
            </span>
            <BottomGradient />
          </button>
        </div>
      </form>
    </div >
  )
}

export default Login