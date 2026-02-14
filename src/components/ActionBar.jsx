import { Play, Send, Zap, Loader2 } from 'lucide-react'

export default function ActionBar({ onRun, loading, onSubmit, isExecutionFinished }) {
    return (
        <div className="h-14 border-t border-green-900/40 bg-gray-950/90 flex items-center justify-between px-4 backdrop-blur-md relative shrink-0">
            <div className="noise-overlay" />

            {/* Run Script Button */}
            <button
                onClick={onRun}
                disabled={loading}
                className={`flex items-center space-x-2 px-5 py-2 rounded-sm text-sm font-bold transition-all duration-300 relative z-10 ${loading
                    ? 'bg-yellow-900/15 text-yellow-500 cursor-wait border border-yellow-900/30'
                    : 'bg-green-900/15 text-green-400 hover:bg-green-900/30 hover:scale-[1.02] active:scale-[0.98] border border-green-900/30 hover:border-green-600/50 animate-pulse-glow'
                    }`}
            >
                {loading
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Play className="w-4 h-4 fill-current" />
                }
                <span className="tracking-wider">{loading ? 'EXECUTING...' : 'RUN SCRIPT'}</span>
            </button>

            {/* Submission Area */}
            <div className="flex items-center space-x-3 w-1/2 justify-end relative z-10">
                <div className="relative w-full max-w-xs group">
                    <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-800 group-focus-within:text-green-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="IDENTIFY ANOMALY (e.g. TMP:99)"
                        className="w-full bg-black/70 border border-green-900/30 rounded-sm py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-green-500/60 focus:shadow-[0_0_10px_rgba(0,255,65,0.1)] text-green-300 placeholder-green-900/40 transition-all duration-300"
                    />
                </div>
                <button
                    onClick={onSubmit}
                    disabled={!isExecutionFinished}
                    className={`px-5 py-2 rounded-sm text-sm font-bold flex items-center space-x-2 transition-all duration-300 tracking-wider ${isExecutionFinished
                        ? 'bg-green-600 text-black hover:bg-green-500 shadow-[0_0_15px_rgba(0,255,65,0.3)] hover:shadow-[0_0_25px_rgba(0,255,65,0.5)] hover:scale-[1.02] active:scale-[0.98]'
                        : 'bg-gray-900/50 text-gray-600 cursor-not-allowed border border-gray-800/50'
                        }`}
                >
                    <span>SUBMIT</span>
                    <Send className="w-3 h-3" />
                </button>
            </div>

        </div>
    )
}
