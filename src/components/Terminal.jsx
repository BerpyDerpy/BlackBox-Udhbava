import { useRef, useEffect } from 'react'
import { Terminal as TerminalIcon } from 'lucide-react'

export default function TerminalOutput({ logs }) {
    const containerRef = useRef(null)

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [logs])

    const getLineStyle = (log) => {
        if (log.includes('ERROR') || log.includes('CRIT')) return 'text-red-400'
        if (log.includes('SUCCESS')) return 'text-green-400 text-glow'
        if (log.includes('RESULT')) return 'text-cyan-400'
        if (log.includes('EXEC')) return 'text-yellow-500'
        if (log.includes('WARNING')) return 'text-amber-400'
        return 'text-green-500/70'
    }

    return (
        <div className="h-full flex flex-col bg-black/90 border-t border-green-900/60 relative">
            <div className="noise-overlay" />
            <div className="flex items-center px-3 py-1.5 bg-green-950/30 border-b border-green-900/40">
                <TerminalIcon className="w-3 h-3 text-green-500 mr-2" />
                <span className="text-[10px] uppercase text-green-600 font-bold tracking-[0.15em]">Terminal Output</span>
                <div className="ml-auto flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/50 animate-pulse" />
                    <span className="text-[9px] text-green-800">LIVE</span>
                </div>
            </div>
            <div ref={containerRef} className="flex-1 p-3 font-mono text-xs overflow-y-auto space-y-0.5">
                {logs.map((log, i) => (
                    <div key={i} className={`break-words leading-relaxed ${getLineStyle(log)}`}>
                        <span className="text-green-900 mr-2 select-none">$</span>
                        {log}
                    </div>
                ))}
                {/* Blinking cursor */}
                <div className="inline-flex items-center mt-1">
                    <span className="text-green-900 mr-2 select-none">$</span>
                    <span className="w-2 h-4 bg-green-500/80 cursor-blink" />
                </div>
            </div>
        </div>
    )
}
