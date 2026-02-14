import { useState, useCallback, useEffect, useRef } from 'react'
import LogViewer from './LogViewer'
import CodeEditor from './Editor'
import TerminalOutput from './Terminal'
import ActionBar from './ActionBar'
import { CORRUPTED_LOG, MOCK_TERMINAL_WELCOME } from '../lib/mockData'

export default function Dashboard({ user }) {
    const [showCleaned, setShowCleaned] = useState(false)
    const [canToggleCleaned, setCanToggleCleaned] = useState(false)
    const [executing, setExecuting] = useState(false)
    const [pyodideReady, setPyodideReady] = useState(false)
    const [logs, setLogs] = useState([MOCK_TERMINAL_WELCOME])
    const [code, setCode] = useState(`# Write your Python script here to parse the corrupted log

# The variable 'raw_log_data' contains the input string.
# Print your process to stdout.
# The LAST line of stdout or the return value will be used as cleaned data.

def clean_data():
    print("Processing data...")
    lines = raw_log_data.split('\\n')
    # Example: return the first line
    return lines[0]

clean_data()`)
    const [cleanedData, setCleanedData] = useState("")

    const workerRef = useRef(null)

    useEffect(() => {
        // Initialize the worker
        workerRef.current = new Worker(new URL('../pyodide-worker.js', import.meta.url));

        workerRef.current.onmessage = (event) => {
            const { type, stdout, result, error } = event.data;

            if (type === 'READY') {
                setPyodideReady(true);
                addLog('> SYSTEM: Python runtime loaded. Ready.');
            } else if (type === 'SUCCESS') {
                if (stdout) {
                    // Split multi-line stdout into separate log entries
                    stdout.split('\n').filter(Boolean).forEach(line => addLog(line));
                }
                if (result !== undefined && result !== null) {
                    addLog(`> RESULT: ${result}`);
                    setCleanedData(String(result));
                    setCanToggleCleaned(true);
                }
                setExecuting(false);
                addLog(`> SUCCESS: Execution finished.`);
            } else if (type === 'ERROR') {
                addLog(`> ERROR: ${error}`);
                setExecuting(false);
            }
        };

        workerRef.current.onerror = (error) => {
            console.error("Worker error:", error);
            addLog(`> SYSTEM ERROR: Worker failed. ${error.message}`);
            setExecuting(false);
        };

        return () => {
            workerRef.current.terminate();
        };
    }, []);

    const addLog = (msg) => {
        setLogs(prev => [...prev, msg])
    }

    const handleRunScript = useCallback(() => {
        if (executing) return

        setExecuting(true)
        // Clear previous execution output but keep welcome message
        setLogs(prev => [prev[0], `> EXEC: Running script.py...`])
        setCanToggleCleaned(false);

        if (workerRef.current) {
            workerRef.current.postMessage({
                pythonCode: code,
                rawLogData: CORRUPTED_LOG
            });
        }
    }, [executing, code])

    const handleSubmit = () => {
        alert("Submission received! (Mock)")
    }

    return (
        <div className="h-screen flex flex-col bg-black text-green-500 overflow-hidden relative">
            {/* CRT Scanline Overlay */}
            <div className="crt-overlay" />

            {/* Header / Status Bar */}
            <div className="h-9 border-b border-green-900/40 flex items-center justify-between px-4 bg-gray-950/80 text-xs backdrop-blur-sm shrink-0 relative z-10">
                <div className="flex items-center space-x-4">
                    <span className="font-bold text-green-400 text-glow tracking-wider">
                        OPERATOR: {user.rollNo}
                    </span>
                    <span className="text-green-800">│</span>
                    <span className="text-green-700 tracking-wider">LEVEL: {user.level}</span>
                </div>
                <div className="flex items-center space-x-3">
                    {!pyodideReady && (
                        <span className="text-yellow-600 text-[10px] tracking-wider animate-pulse">
                            ⟳ LOADING PYTHON RUNTIME...
                        </span>
                    )}
                    <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_6px_rgba(0,255,65,0.5)]" />
                        <span className="text-green-600 tracking-wider">ONLINE</span>
                    </div>
                </div>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden min-h-0">

                {/* Left Pane: Log Viewer */}
                <div className="w-1/2 h-full">
                    <LogViewer
                        originalData={CORRUPTED_LOG}
                        cleanedData={cleanedData}
                        showCleaned={showCleaned}
                        onToggle={() => setShowCleaned(!showCleaned)}
                        canToggle={canToggleCleaned}
                    />
                </div>

                {/* Right Pane: Editor & Terminal */}
                <div className="w-1/2 h-full flex flex-col border-l border-green-900/40 overflow-hidden">
                    <div className="flex-1 min-h-0 overflow-hidden">
                        <CodeEditor code={code} onChange={setCode} />
                    </div>
                    <div className="h-48 shrink-0">
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
