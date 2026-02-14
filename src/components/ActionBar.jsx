import { Play, Send, Zap } from 'lucide-react'

export default function ActionBar({ onRun, loading, onSubmit, isExecutionFinished }) {
    return (
        <div className="h-14 border-t border-green-900 bg-gray-900/80 flex items-center justify-between px-4 backdrop-blur">

            {/* Run Script Button */}
            <button
                onClick={onRun}
                disabled={loading}
                className={`flex items-center space-x-2 px-4 py-2 rounded text-sm font-bold transition-all ${loading
                        ? 'bg-yellow-900/20 text-yellow-500 cursor-wait'
                        : 'bg-green-900/20 text-green-400 hover:bg-green-900/40 hover:scale-105 active:scale-95'
                    }`}
            >
                <Play className={`w-4 h-4 ${loading ? 'animate-spin' : 'fill-current'}`} />
                <span>{loading ? 'EXECUTING...' : 'RUN SCRIPT'}</span>
            </button>

            {/* Submission Area */}
            <div className="flex items-center space-x-3 w-1/2 justify-end">
                <div className="relative w-full max-w-xs group">
                    <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-700 group-focus-within:text-green-400" />
                    <input
                        type="text"
                        placeholder="IDENTIFY ANOMALY (e.g. TMP:99)"
                        className="w-full bg-black border border-green-900 rounded py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-green-500 text-green-300 placeholder-green-900/50"
                    />
                </div>
                <button
                    onClick={onSubmit}
                    disabled={!isExecutionFinished} // Require execution before submitting? Or allow anytime. Let's say execution first.
                    className={`px-4 py-2 rounded text-sm font-bold flex items-center space-x-2 ${isExecutionFinished
                            ? 'bg-green-600 text-black hover:bg-green-500 shadow-[0_0_10px_rgba(0,255,65,0.4)]'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    <span>SUBMIT</span>
                    <Send className="w-3 h-3" />
                </button>
            </div>

        </div>
    )
}
