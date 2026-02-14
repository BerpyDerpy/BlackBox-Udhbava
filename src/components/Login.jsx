import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Terminal, Lock } from 'lucide-react'

export default function Login({ onLogin }) {
    const [rollNo, setRollNo] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            if (!rollNo.trim()) throw new Error('ENTER ROLL NUMBER')

            // Check if user exists (Mocking this check if table doesn't exist yet for dev flow)
            // In real prod:
            // const { data, error: fetchError } = await supabase
            //   .from('users')
            //   .select('roll_no, current_level')
            //   .eq('roll_no', rollNo)
            //   .single()

            // For Phase 1 Dev (Allow any roll number or specific one)
            // We start with a real call, if it fails due to table missing, we warn.

            const { data, error: dbError } = await supabase
                .from('users')
                .select('*')
                .eq('roll_no', rollNo)
                .maybeSingle()

            if (dbError) {
                // Fallback for development if table pending
                console.warn("Supabase Error (Ignored for Proto):", dbError)
                // throw dbError 
            }

            // Simulate successful login for prototype
            // In prod, check data exists
            onLogin({ rollNo, level: data?.current_level || 1 })

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black font-mono text-green-500 selection:bg-green-900">
            <div className="w-full max-w-md p-8 border border-green-800 bg-gray-900/50 shadow-[0_0_20px_rgba(0,255,65,0.1)] backdrop-blur-sm relative overflow-hidden">

                {/* CRT Scanline Effect Overlay (Optional CSS polish can happen later, keeping markup simple) */}

                <div className="text-center mb-8">
                    <Terminal className="w-12 h-12 mx-auto mb-4 animate-pulse text-green-400" />
                    <h1 className="text-2xl font-bold tracking-widest text-shadow-glow">BLACK BOX SYSTEM</h1>
                    <p className="text-xs text-green-700 mt-2">SECURE_CHANNEL_ESTABLISHED::V1.0.4</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative group">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-green-800 group-focus-within:text-green-500 transition-colors" />
                        <input
                            type="text"
                            value={rollNo}
                            onChange={(e) => setRollNo(e.target.value.toUpperCase())}
                            placeholder="ENTER ROLL NUMBER >"
                            className="w-full bg-black border border-green-900 rounded py-3 pl-10 pr-4 focus:outline-none focus:border-green-500 focus:shadow-[0_0_10px_rgba(0,255,65,0.3)] transition-all placeholder-green-900 text-lg"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm border border-red-900 p-2 bg-red-900/10 animate-pulse">
                            [ERROR]: {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-900/20 hover:bg-green-500 hover:text-black border border-green-700 text-green-500 py-3 font-bold transition-all duration-300 uppercase tracking-wider relative overflow-hidden group"
                    >
                        {loading ? 'AUTHENTICATING...' : 'INITIALIZE_SESSION()'}
                        <div className="absolute inset-0 bg-green-500/10 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12" />
                    </button>
                </form>

                <div className="mt-8 text-center text-[10px] text-green-900">
                    <p>UNAUTHORIZED ACCESS WILL RESULT IN IMMEDIATE TERMINATION.</p>
                    <p>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
            </div>
        </div>
    )
}
