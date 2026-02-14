import { Eye, EyeOff } from 'lucide-react'

export default function LogViewer({ originalData, cleanedData, showCleaned, onToggle, canToggle }) {
    return (
        <div className="flex flex-col h-full border-r border-green-900 bg-gray-900/30">
            <div className="flex items-center justify-between p-2 border-b border-green-900 bg-black">
                <span className="text-xs uppercase font-bold tracking-wider text-green-600">
                    Source Data Stream
                </span>
                <button
                    onClick={onToggle}
                    disabled={!canToggle}
                    className={`flex items-center space-x-2 text-xs px-2 py-1 rounded transition-colors ${canToggle
                            ? 'hover:bg-green-900/50 text-green-400 cursor-pointer'
                            : 'text-gray-600 cursor-not-allowed'
                        }`}
                >
                    {showCleaned ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{showCleaned ? 'VIEW CLEANED' : 'VIEW RAW'}</span>
                </button>
            </div>
            <div className="flex-1 relative overflow-hidden">
                <textarea
                    readOnly
                    value={showCleaned ? cleanedData : originalData}
                    className={`w-full h-full bg-transparent p-4 font-mono text-sm resize-none focus:outline-none ${showCleaned ? 'text-green-300' : 'text-red-400 opacity-80'
                        }`}
                    spellCheck="false"
                />
                {/* Subtle grid overlay */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
            </div>
        </div>
    )
}
