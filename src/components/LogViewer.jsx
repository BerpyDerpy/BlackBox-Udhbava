import { Eye, EyeOff, Database } from 'lucide-react'

export default function LogViewer({ originalData, cleanedData, showCleaned, onToggle, canToggle }) {
    const dataToShow = showCleaned ? cleanedData : originalData
    const lines = dataToShow ? dataToShow.split('\n') : []

    return (
        <div className="flex flex-col h-full border-r border-green-900/40 bg-gray-950/50 relative">
            <div className="noise-overlay" />
            <div className="flex items-center justify-between px-3 py-2 border-b border-green-900/40 bg-black/80 relative z-10">
                <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs uppercase font-bold tracking-[0.15em] text-green-500 text-glow">
                        Source Data Stream
                    </span>
                </div>
                <button
                    onClick={onToggle}
                    disabled={!canToggle}
                    className={`flex items-center space-x-2 text-xs px-2.5 py-1 rounded transition-all duration-300 ${canToggle
                        ? 'hover:bg-green-900/30 text-green-400 cursor-pointer border border-green-900/30 hover:border-green-700/50'
                        : 'text-gray-700 cursor-not-allowed'
                        }`}
                >
                    {showCleaned ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{showCleaned ? 'VIEW CLEANED' : 'VIEW RAW'}</span>
                </button>
            </div>
            <div className="flex-1 relative overflow-hidden">
                <div className="h-full overflow-y-auto p-4 font-mono text-sm">
                    {lines.map((line, i) => (
                        <div key={i} className="flex group hover:bg-green-900/5 transition-colors">
                            <span className="w-8 shrink-0 text-right pr-3 text-green-900/40 select-none text-xs leading-6">
                                {i + 1}
                            </span>
                            <span className={`leading-6 ${showCleaned
                                ? 'text-green-300'
                                : line.includes('ERR') || line.includes('CRIT')
                                    ? 'text-red-400'
                                    : line.includes('NOISE') || line.includes('$$') || line.includes('@@') || line.includes('((')
                                        ? 'text-red-400/50'
                                        : 'text-amber-400/80'
                                }`}>
                                {line || '\u00A0'}
                            </span>
                        </div>
                    ))}
                </div>
                {/* Grid overlay */}
                <div className="grid-overlay" />
            </div>
        </div>
    )
}
