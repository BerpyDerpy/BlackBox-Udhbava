import { useState } from 'react'
import { supabase, ADMIN_ROLL_NO } from '../lib/supabase'
import { Terminal, Lock, Shield } from 'lucide-react'

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

            const { data, error: dbError } = await supabase
                .from('users')
                .select('*')
                .eq('roll_no', rollNo.trim())
                .maybeSingle()

            if (dbError) {
                console.error("Supabase Error:", dbError)
                throw new Error('DATABASE CONNECTION FAILED')
            }

            // REJECT if user not found in the database
            if (!data) {
                throw new Error('ACCESS DENIED: UNAUTHORIZED ID')
            }

            onLogin({
                rollNo: data.roll_no,
                level: data.current_level || 1,
                isAdmin: data.roll_no === ADMIN_ROLL_NO,
            })

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black font-mono text-green-500 selection:bg-green-900 relative">
            {/* CRT Scanline Overlay */}
            <div className="crt-overlay" />

            {/* Ambient glow behind the card */}
            <div className="absolute w-96 h-96 bg-green-500/5 rounded-full blur-[120px] animate-pulse" />

            <div className="w-full max-w-md p-8 border border-green-800/60 bg-gray-950/80 shadow-[0_0_30px_rgba(0,255,65,0.08)] backdrop-blur-md relative overflow-hidden animate-boot">
                {/* Noise overlay */}
                <div className="noise-overlay" />

                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-green-500/40" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-green-500/40" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-green-500/40" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-green-500/40" />

                <div className="text-center mb-8 animate-boot animate-boot-delay-1">
                    <div className="relative inline-block">
                        <Terminal className="w-14 h-14 mx-auto mb-4 text-green-400 animate-pulse" />
                        <div className="absolute inset-0 w-14 h-14 mx-auto bg-green-500/10 rounded-full blur-xl" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-[0.25em] text-glow-strong">
                        BLACK BOX
                    </h1>
                    <h2 className="text-lg tracking-[0.3em] text-green-600 mt-1">SYSTEM</h2>
                    <div className="flex items-center justify-center gap-2 mt-3">
                        <Shield className="w-3 h-3 text-green-800" />
                        <p className="text-[10px] text-green-800 tracking-widest">
                            SECURE_CHANNEL::V1.0.4
                        </p>
                        <Shield className="w-3 h-3 text-green-800" />
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 animate-boot animate-boot-delay-2">
                    <div className="relative group">
                        <Lock className="absolute left-3 top-3.5 w-5 h-5 text-green-800 group-focus-within:text-green-400 transition-colors duration-300" />
                        <input
                            type="text"
                            value={rollNo}
                            onChange={(e) => setRollNo(e.target.value.toUpperCase())}
                            placeholder="ENTER ROLL NUMBER >"
                            className="w-full bg-black/80 border border-green-900/50 rounded-sm py-3 pl-10 pr-4 focus:outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(0,255,65,0.15)] transition-all duration-300 placeholder-green-900/60 text-lg tracking-wider"
                            autoFocus
                        />
                        <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-green-500 group-focus-within:w-full transition-all duration-500" />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm border border-red-900/50 p-2 bg-red-950/30 animate-pulse font-bold tracking-wider">
                            <span className="text-red-700">[ERROR]:</span> {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-900/10 hover:bg-green-500 hover:text-black border border-green-700/50 hover:border-green-400 text-green-500 py-3 font-bold transition-all duration-300 uppercase tracking-[0.2em] relative overflow-hidden group hover:shadow-[0_0_20px_rgba(0,255,65,0.3)]"
                    >
                        <span className="relative z-10">
                            {loading ? 'AUTHENTICATING...' : 'INITIALIZE_SESSION()'}
                        </span>
                        <div className="absolute inset-0 bg-green-500/5 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
                    </button>
                </form>

                <div className="mt-8 text-center text-[10px] text-green-900/60 animate-boot animate-boot-delay-3 space-y-1">
                    <p className="tracking-widest">⚠ UNAUTHORIZED ACCESS WILL RESULT IN IMMEDIATE TERMINATION ⚠</p>
                    <p className="font-mono">SESSION_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
            </div>
        </div>
    )
}
