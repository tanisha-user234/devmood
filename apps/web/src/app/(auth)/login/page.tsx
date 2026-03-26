'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import Link from "next/link";

export default function LoginPage(){
    const [formData,setFormData] = useState({email:'',password:''})
    const [error,setError] = useState('')
    const [loading, setLoading] = useState(false)
    const {login}= useAuth();
    const router= useRouter()

    const handleChange =(e:React.ChangeEvent<HTMLInputElement>)=>{
        setFormData(prev =>({...prev,[e.target.name]:e.target.value}))
    }

    const handleSubmit = async (e:React.FormEvent)=>{
        e.preventDefault()
        setError('');
        setLoading(true)
        try {
            await login(formData.email,formData.password)
            router.push('/dashboard')
            // router.refresh()
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'Login failed')
            
        }finally{
            setLoading(false);
        }
    }
    
    return(
        <div className="bg-gray-900/70 backdrop-blur-xl rounded-2xl p-8 border border-gray-800 shadow-2xl shadow-indigo-950/20">
            <h2 className="text-xl font-semibold text-white mb-2">Welcome Back</h2>
            <p className="text-sm text-gray-400 mb-6">Sign in to continue your developer journal.</p>
             {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                    {error}
                </div>
             )}
             <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-gray-800/80 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full bg-gray-800/80 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            placeholder="Your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-indigo-600/60 disabled:to-violet-600/60 text-white rounded-lg py-2.5 text-sm font-medium transition-all mt-2 shadow-lg shadow-indigo-900/40"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-indigo-400 hover:text-indigo-300">
          Sign up
        </Link>
      </p>
    </div>
    )
}