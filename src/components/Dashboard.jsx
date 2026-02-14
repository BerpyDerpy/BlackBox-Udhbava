import { useState, useCallback } from 'react'
import LogViewer from './LogViewer'
import CodeEditor from './Editor'
import TerminalOutput from './Terminal'
import ActionBar from './ActionBar'
import { CORRUPTED_LOG, CLEANED_LOG, MOCK_TERMINAL_WELCOME } from '../lib/mockData'

export default function Dashboard({ user }) {
    const [showCleaned, setShowCleaned] = useState(false)
    const [canToggleCleaned, setCanToggleCleaned] = useState(false)
    const [executing, setExecuting] = useState(false)
    const [logs, setLogs] = useState([MOCK_TERMINAL_WELCOME])
    const [code, setCode] = useState("# Write your Python script here to parse the corrupted log\n\ndef clean_data(raw_data):\n    # TODO: Remove noise characters\n    pass")

    const addLog = (msg) => {
        setLogs(prev => [...prev, msg])
    }

    const handleRunScript = useCallback(() => {
        if (executing) return

        setExecuting(true)
        addLog(`> EXEC: script.py...`)

        // Mock delay for execution
        setTimeout(() => {
            setExecuting(false)
            setCanToggleCleaned(true)
            addLog(`> SUCCESS: Mock execution finished.`)
            addLog(`> OUTPUT: Data filter applied. 5 records processed.`)
            addLog(`> SYSTEM: Decryption key found. View filtered data enabled.`)
        }, 2000)
    }, [executing])

    const handleSubmit = () => {
        alert("Submission received! (Mock)")
    }

    return (
        <div className="h-screen flex flex-col bg-black text-green-500 overflow-hidden">
            {/* Header / Status Bar */}
            <div className="h-8 border-b border-green-900 flex items-center justify-between px-4 bg-gray-900/50 text-xs">
                <div className="flex space-x-4">
                    <span className="font-bold text-green-400">OPERATOR: {user.rollNo}</span>
                    <span className="text-gray-500">LEVEL: {user.level}</span>
                </div>
                <div className="flex space-x-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span>ONLINE</span>
                </div>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left Pane: Log Viewer */}
                <div className="w-1/2 h-full">
                    <LogViewer
                        originalData={CORRUPTED_LOG}
                        cleanedData={CLEANED_LOG}
                        showCleaned={showCleaned}
                        onToggle={() => setShowCleaned(!showCleaned)}
                        canToggle={canToggleCleaned}
                    />
                </div>

                {/* Right Pane: Editor & Terminal */}
                <div className="w-1/2 h-full flex flex-col border-l border-green-900">
                    <div className="flex-1">
                        <CodeEditor code={code} onChange={setCode} />
                    </div>
                    <div className="h-48">
                        <TerminalOutput logs={logs} />
                    </div>
                </div>

            </div>

            {/* Bottom Action Bar */}
            <ActionBar
                onRun={handleRunScript}
                loading={executing}
                onSubmit={handleSubmit}
                isExecutionFinished={canToggleCleaned}
            />
        </div>
    )
}
