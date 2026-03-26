'use client';

import { useAuth } from '@/context/authContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {useState} from 'react';

export default function RegisterPage() {
    const [formData, setFormData] =useState({
        name:'',
        email:'',
        password:''
    })

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const {register }= useAuth();
    const router= useRouter();

    const handleChange =(e: React.
        ChangeEvent<HTMLInputElement>) =>{
            setFormData(prev => ({...prev, [e.target.name]: e.target.value}))
        }

    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await register(formData.name, formData.email,formData.password)
            router.push('/dashboard')
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'Registration failed')
        }finally{
            setLoading(false)
        }
    }
    return(
        <div className='bg-gray-900/70 backdrop-blur-xl rounded-2xl p-8 border border-gray-800 shadow-2xl shadow-indigo-950/20'>
            <h2 className='text-xl font-semibold text-white mb-6'>
                Create Your account
            </h2>
            {error &&(
                <div className='bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm'>
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm text-gray-400 mb-1'>Name</label>
                <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
                className='w-full bg-gray-800/80 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all'
                placeholder='Your name'
                />
              </div>
              <div>
                <label className='block text-sm text-gray-400 mb-1'>Email</label>
                <input
                type='email'
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className='w-full bg-gray-800/80 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all'
                placeholder='abc@example.com'
                />
              </div>
              <div>
                <label className='block text-sm text-gray-400 mb-1'>Password</label>
                <input
                type='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className='w-full bg-gray-800/80 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all'
                placeholder='Min 6 characters'
                /> 
              </div>
              <button
              type='submit'
              disabled={loading}
              className='w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-indigo-600/60 disabled:to-violet-600/60 text-white rounded-lg py-2.5 text-sm font-medium transition-all mt-2 shadow-lg shadow-indigo-900/40'
              >
                {loading?'Creating Account....':'Create Account'}

              </button>
            </form>
            <p className='text-center text-sm text-gray-500 mt-6'>
                Already have an account?{' '}
               <Link href='/login' className='text-indigo-400'>
               Sign In</Link> 
            </p>
        </div>
    )
}