import { useState, useEffect } from 'react'
import { supabase, ADMIN_ROLL_NO } from '../lib/supabase'
import { UserPlus, Users, Trash2, ArrowLeft, Shield, Loader2 } from 'lucide-react'

export default function AdminPanel({ onBack }) {
    const [users, setUsers] = useState([])
    const [newRollNo, setNewRollNo] = useState('')
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [feedback, setFeedback] = useState(null)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        setFetching(true)
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Fetch error:', error)
            setFeedback({ type: 'error', msg: 'FAILED TO FETCH USER REGISTRY' })
        } else {
            setUsers(data || [])
        }
        setFetching(false)
    }

    const handleAddUser = async (e) => {
        e.preventDefault()
        if (!newRollNo.trim()) return

        setLoading(true)
        setFeedback(null)

        // Check for duplicate
        const existing = users.find(u => u.roll_no === newRollNo.trim().toUpperCase())
        if (existing) {
            setFeedback({ type: 'error', msg: `ID ${newRollNo.trim().toUpperCase()} ALREADY EXISTS` })
            setLoading(false)
            return
        }

        const { error } = await supabase
            .from('users')
            .insert([{ roll_no: newRollNo.trim().toUpperCase(), current_level: 1 }])

        if (error) {
            console.error('Insert error:', error)
            setFeedback({ type: 'error', msg: `INSERT FAILED: ${error.message}` })
        } else {
            setFeedback({ type: 'success', msg: `USER ${newRollNo.trim().toUpperCase()} ADDED SUCCESSFULLY` })
            setNewRollNo('')
            fetchUsers()
        }
        setLoading(false)
    }

    const handleDeleteUser = async (rollNo) => {
        if (rollNo === ADMIN_ROLL_NO) {
            setFeedback({ type: 'error', msg: 'CANNOT DELETE ADMIN ACCOUNT' })
            return
        }

        const { error } = await supabase
            .from('users')
            .delete()
            .eq('roll_no', rollNo)

        if (error) {
            console.error('Delete error:', error)
            setFeedback({ type: 'error', msg: `DELETE FAILED: ${error.message}` })
        } else {
            setFeedback({ type: 'success', msg: `USER ${rollNo} REMOVED` })
            fetchUsers()
        }
    }

    return (
        <div className="h-screen flex flex-col bg-black text-green-500 overflow-hidden relative">
            <div className="crt-overlay" />

            {/* Header */}
            <div className="h-12 border-b border-green-900/40 flex items-center justify-between px-4 bg-gray-950/80 backdrop-blur-sm shrink-0 relative z-10">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={onBack}
                        className="flex items-center space-x-2 text-green-600 hover:text-green-400 transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="tracking-wider">BACK</span>
                    </button>
                    <span className="text-green-800">│</span>
                    <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold text-yellow-500 tracking-wider text-sm text-glow">
                            ADMIN CONTROL PANEL
                        </span>
                    </div>
                </div>
                <span className="text-green-800 text-xs tracking-wider">
                    CLEARANCE: LEVEL_MAX
                </span>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden min-h-0">

                {/* Left: Add User Form */}
                <div className="w-1/3 border-r border-green-900/40 p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <UserPlus className="w-5 h-5 text-green-500" />
                        <h2 className="text-sm font-bold tracking-[0.15em] text-green-400 text-glow">
                            REGISTER NEW OPERATOR
                        </h2>
                    </div>

                    <form onSubmit={handleAddUser} className="space-y-4">
                        <div className="relative group">
                            <input
                                type="text"
                                value={newRollNo}
                                onChange={(e) => setNewRollNo(e.target.value.toUpperCase())}
                                placeholder="ENTER ROLL NUMBER >"
                                className="w-full bg-black/80 border border-green-900/50 rounded-sm py-3 px-4 focus:outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(0,255,65,0.15)] transition-all duration-300 placeholder-green-900/60 text-lg tracking-wider"
                            />
                            <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-green-500 group-focus-within:w-full transition-all duration-500" />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-900/15 text-green-400 hover:bg-green-900/30 border border-green-900/30 hover:border-green-600/50 py-3 font-bold transition-all duration-300 uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                            <span>{loading ? 'INSERTING...' : 'ADD_USER()'}</span>
                        </button>
                    </form>

                    {/* Feedback */}
                    {feedback && (
                        <div className={`mt-4 p-3 border rounded-sm text-sm font-bold tracking-wider animate-boot ${feedback.type === 'success'
                            ? 'border-green-700/50 bg-green-950/30 text-green-400'
                            : 'border-red-900/50 bg-red-950/30 text-red-400'
                            }`}>
                            <span className={feedback.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                                [{feedback.type === 'success' ? 'OK' : 'ERR'}]:
                            </span>{' '}
                            {feedback.msg}
                        </div>
                    )}

                    <div className="mt-auto pt-6 text-[10px] text-green-900/40 tracking-wider space-y-1">
                        <p>• NEW USERS START AT LEVEL 1</p>
                        <p>• ADMIN ACCOUNTS CANNOT BE DELETED</p>
                        <p>• ALL ACTIONS ARE LOGGED</p>
                    </div>
                </div>

                {/* Right: User Registry */}
                <div className="flex-1 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-green-500" />
                            <h2 className="text-sm font-bold tracking-[0.15em] text-green-400 text-glow">
                                USER REGISTRY
                            </h2>
                        </div>
                        <span className="text-xs text-green-800 tracking-wider">
                            {users.length} ENTRIES
                        </span>
                    </div>

                    {fetching ? (
                        <div className="flex-1 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-green-700" />
                            <span className="ml-2 text-green-700 tracking-wider text-sm">LOADING REGISTRY...</span>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto space-y-1">
                            {/* Table header */}
                            <div className="flex items-center px-3 py-2 text-[10px] text-green-700 tracking-wider border-b border-green-900/30 sticky top-0 bg-black">
                                <span className="w-16">IDX</span>
                                <span className="flex-1">ROLL_NO</span>
                                <span className="w-20 text-center">LEVEL</span>
                                <span className="w-20 text-center">ACTION</span>
                            </div>

                            {users.map((user, i) => (
                                <div
                                    key={user.roll_no}
                                    className="flex items-center px-3 py-2.5 hover:bg-green-900/10 transition-colors border-b border-green-900/10 group"
                                >
                                    <span className="w-16 text-green-900/60 text-xs">{String(i + 1).padStart(3, '0')}</span>
                                    <span className={`flex-1 text-sm tracking-wider ${user.roll_no === ADMIN_ROLL_NO ? 'text-yellow-500 font-bold' : 'text-green-400'}`}>
                                        {user.roll_no}
                                        {user.roll_no === ADMIN_ROLL_NO && (
                                            <span className="ml-2 text-[9px] text-yellow-700 border border-yellow-800/30 px-1.5 py-0.5 rounded-sm">
                                                ADMIN
                                            </span>
                                        )}
                                    </span>
                                    <span className="w-20 text-center text-green-600 text-sm">{user.current_level || 1}</span>
                                    <span className="w-20 text-center">
                                        {user.roll_no !== ADMIN_ROLL_NO && (
                                            <button
                                                onClick={() => handleDeleteUser(user.roll_no)}
                                                className="text-red-900/50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                title="Remove user"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 mx-auto" />
                                            </button>
                                        )}
                                    </span>
                                </div>
                            ))}

                            {users.length === 0 && (
                                <div className="text-center py-10 text-green-900/40 tracking-wider text-sm">
                                    NO USERS IN REGISTRY
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
