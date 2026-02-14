import { useRef, useEffect } from 'react'
import { Terminal as TerminalIcon } from 'lucide-react'

export default function TerminalOutput({ logs }) {
    const endRef = useRef(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [logs])

    return (
        <div className="h-full flex flex-col bg-black border-t border-green-900">
            <div className="flex items-center px-2 py-1 bg-green-900/20 border-b border-green-900/50">
                <TerminalIcon className="w-3 h-3 text-green-500 mr-2" />
                <span className="text-[10px] uppercase text-green-600 font-bold">Terminal Output</span>
            </div>
            <div className="flex-1 p-2 font-mono text-xs overflow-y-auto space-y-1 text-green-500/80">
                {logs.map((log, i) => (
                    <div key={i} className="break-words">
                        <span className="opacity-50 mr-2">$</span>
                        {log}
                    </div>
                ))}
                <div ref={endRef} />
            </div>
        </div>
    )
}
