import { useState, useCallback, useEffect, useRef } from 'react'
import LogViewer from './LogViewer'
import CodeEditor from './Editor'
import TerminalOutput from './Terminal'
import ActionBar from './ActionBar'
import HelpModal from './HelpModal'
import { LEVEL_META, TOTAL_LEVELS, MOCK_TERMINAL_WELCOME, loadLevelLog, checkAnswer } from '../lib/LevelData'
import { supabase } from '../lib/supabase'
import { Shield, LogOut, HelpCircle, Timer, Trophy } from 'lucide-react'

export default function Dashboard({ user, onToggleAdmin, onLogout }) {
    const [currentLevel, setCurrentLevel] = useState(user.level || 1)
    const levelMeta = LEVEL_META[currentLevel] || LEVEL_META[1]

    const [corruptedLog, setCorruptedLog] = useState('')
    const [loadingLog, setLoadingLog] = useState(true)

    const [showCleaned, setShowCleaned] = useState(false)
    const [canToggleCleaned, setCanToggleCleaned] = useState(false)
    const [executing, setExecuting] = useState(false)
    const [pyodideReady, setPyodideReady] = useState(false)
    const [logs, setLogs] = useState([MOCK_TERMINAL_WELCOME])
    const [code, setCode] = useState('')
    const [cleanedData, setCleanedData] = useState("")
    const [answer, setAnswer] = useState("")
    const [submitFeedback, setSubmitFeedback] = useState(null)
    const [showHelp, setShowHelp] = useState(false)
    const [levelStartTime, setLevelStartTime] = useState(Date.now())
    const [elapsedSeconds, setElapsedSeconds] = useState(0)
    const [totalScore, setTotalScore] = useState(user.score || 0)

    const workerRef = useRef(null)

    // Reset editor boilerplate when level changes
    const buildStarterCode = (meta) => `# Write your Python script here to parse the corrupted log
# Difficulty: ${meta.label}
# Hint: ${meta.hint}

# The variable 'raw_log_data' contains the input string.
# Print your process to stdout.
# The LAST line of stdout or the return value will be used as cleaned data.

def clean_data():
    print("Processing data...")
    lines = raw_log_data.split('\\n')
    # Example: return the first line
    return lines[0]

clean_data()`

    // Load the level's .txt file
    useEffect(() => {
        let cancelled = false
        setLoadingLog(true)
        loadLevelLog(currentLevel)
            .then(text => {
                if (!cancelled) {
                    setCorruptedLog(text)
                    setLoadingLog(false)
                    addLog(`> SYSTEM: Level ${currentLevel} data stream loaded. Difficulty: ${levelMeta.label}`)
                }
            })
            .catch(err => {
                if (!cancelled) {
                    setCorruptedLog('[ERROR] Failed to load log data.')
                    setLoadingLog(false)
                    addLog(`> ERROR: ${err.message}`)
                }
            })
        return () => { cancelled = true }
    }, [currentLevel])

    // Timer — ticks every second
    useEffect(() => {
        setLevelStartTime(Date.now())
        setElapsedSeconds(0)
        const interval = setInterval(() => {
            setElapsedSeconds(prev => prev + 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [currentLevel])

    // Set starter code on mount / level change
    useEffect(() => {
        setCode(buildStarterCode(levelMeta))
    }, [currentLevel])

    // Pyodide worker
    useEffect(() => {
        workerRef.current = new Worker(new URL('../pyodide-worker.js', import.meta.url));

        workerRef.current.onmessage = (event) => {
            const { type, stdout, result, error } = event.data;

            if (type === 'READY') {
                setPyodideReady(true);
                addLog('> SYSTEM: Python runtime loaded. Ready.');
            } else if (type === 'SUCCESS') {
                if (stdout) {
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
        setLogs(prev => [prev[0], `> EXEC: Running script.py...`])
        setCanToggleCleaned(false);
        setSubmitFeedback(null);

        if (workerRef.current) {
            workerRef.current.postMessage({
                pythonCode: code,
                rawLogData: corruptedLog
            });
        }
    }, [executing, code, corruptedLog])

    const calculateLevelScore = () => {
        const seconds = Math.floor((Date.now() - levelStartTime) / 1000)
        return Math.max(100, 1000 - seconds * 2)
    }

    const persistScore = async (newScore, nextLevel) => {
        try {
            await supabase
                .from('users')
                .update({ score: newScore, current_level: nextLevel })
                .eq('roll_no', user.rollNo)
        } catch (err) {
            console.error('Failed to persist score:', err)
        }
    }

    const advanceLevel = () => {
        const nextLevel = currentLevel + 1
        if (nextLevel > TOTAL_LEVELS) {
            addLog('> ★ ALL LEVELS COMPLETED! YOU HAVE MASTERED THE BLACK BOX.')
            setSubmitFeedback({ type: 'success', msg: 'ALL LEVELS COMPLETED! CONGRATULATIONS, OPERATOR.' })
            return
        }

        // Reset state for next level
        setCurrentLevel(nextLevel)
        setShowCleaned(false)
        setCanToggleCleaned(false)
        setCleanedData('')
        setAnswer('')
        setSubmitFeedback(null)
        setLogs([MOCK_TERMINAL_WELCOME])

        // Persist new level
        const saved = localStorage.getItem('blackbox_user')
        if (saved) {
            const userData = JSON.parse(saved)
            userData.level = nextLevel
            userData.score = totalScore
            localStorage.setItem('blackbox_user', JSON.stringify(userData))
        }
    }

    const handleSubmit = () => {
        if (!answer.trim()) {
            setSubmitFeedback({ type: 'error', msg: 'ENTER YOUR ANSWER FIRST' })
            return
        }

        if (checkAnswer(answer, currentLevel)) {
            const levelScore = calculateLevelScore()
            const newTotal = totalScore + levelScore
            setTotalScore(newTotal)
            setSubmitFeedback({ type: 'success', msg: `CORRECT! +${levelScore} PTS (${formatTime(elapsedSeconds)})` })
            addLog(`> ✓ SUBMISSION ACCEPTED — SCORE: +${levelScore}`)

            // Persist to Supabase and advance
            persistScore(newTotal, currentLevel + 1)
            setTimeout(() => advanceLevel(), 2000)
        } else {
            setSubmitFeedback({ type: 'error', msg: `INCORRECT. TRY AGAIN.` })
            addLog(`> ✗ SUBMISSION REJECTED: "${answer}" does not match.`)
        }
    }

    const formatTime = (s) => {
        const mins = String(Math.floor(s / 60)).padStart(2, '0')
        const secs = String(s % 60).padStart(2, '0')
        return `${mins}:${secs}`
    }

    return (
        <div className="h-screen flex flex-col bg-black text-green-500 overflow-hidden relative">
            {/* Help Modal */}
            {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
            {/* CRT Scanline Overlay */}
            <div className="crt-overlay" />

            {/* Header / Status Bar */}
            <div className="h-9 border-b border-green-900/40 flex items-center justify-between px-4 bg-gray-950/80 text-xs backdrop-blur-sm shrink-0 relative z-10">
                <div className="flex items-center space-x-4">
                    <span className="font-bold text-green-400 text-glow tracking-wider">
                        OPERATOR: {user.rollNo}
                    </span>
                    <span className="text-green-800">│</span>
                    <span className="text-green-700 tracking-wider">LEVEL: {currentLevel} / {TOTAL_LEVELS}</span>
                    <span className="text-green-800">│</span>
                    <span className="text-green-800">│</span>
                    <span className="flex items-center gap-1.5 text-green-600 tracking-wider">
                        <Timer className="w-3 h-3" />
                        {formatTime(elapsedSeconds)}
                    </span>
                    <span className="text-green-800">│</span>
                    <span className="flex items-center gap-1.5 text-yellow-500 tracking-wider">
                        <Trophy className="w-3 h-3" />
                        {totalScore} PTS
                    </span>
                    <span className="text-green-800">│</span>
                    <span className={`tracking-wider ${currentLevel === 1 ? 'text-green-500' : currentLevel === 2 ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                        DIFFICULTY: {levelMeta.label}
                    </span>
                </div>
                <div className="flex items-center space-x-3">
                    {!pyodideReady && (
                        <span className="text-yellow-600 text-[10px] tracking-wider animate-pulse">
                            ⟳ LOADING PYTHON RUNTIME...
                        </span>
                    )}
                    {loadingLog && (
                        <span className="text-yellow-600 text-[10px] tracking-wider animate-pulse">
                            ⟳ LOADING LOG DATA...
                        </span>
                    )}
                    <button
                        onClick={() => setShowHelp(true)}
                        className="flex items-center space-x-1.5 text-green-600 hover:text-green-400 transition-colors px-2 py-1 border border-green-900/30 hover:border-green-600/50 rounded-sm"
                        title="Help / Rules"
                    >
                        <HelpCircle className="w-3 h-3" />
                        <span className="tracking-wider text-[10px]">HELP</span>
                    </button>
                    {onToggleAdmin && (
                        <button
                            onClick={onToggleAdmin}
                            className="flex items-center space-x-1.5 text-yellow-600 hover:text-yellow-400 transition-colors px-2 py-1 border border-yellow-900/30 hover:border-yellow-600/50 rounded-sm"
                            title="Admin Panel"
                        >
                            <Shield className="w-3 h-3" />
                            <span className="tracking-wider text-[10px]">ADMIN</span>
                        </button>
                    )}
                    <button
                        onClick={onLogout}
                        className="flex items-center space-x-1.5 text-red-700 hover:text-red-500 transition-colors px-2 py-1 border border-red-900/20 hover:border-red-700/50 rounded-sm"
                        title="Logout"
                    >
                        <LogOut className="w-3 h-3" />
                        <span className="tracking-wider text-[10px]">EXIT</span>
                    </button>
                    <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_6px_rgba(0,255,65,0.5)]" />
                        <span className="text-green-600 tracking-wider">ONLINE</span>
                    </div>
                </div>
            </div>

            {/* Submit Feedback Banner */}
            {submitFeedback && (
                <div className={`px-4 py-2.5 text-sm font-bold tracking-wider flex items-center justify-between relative z-10 ${submitFeedback.type === 'success'
                    ? 'bg-green-950/50 border-b border-green-700/40 text-green-400'
                    : 'bg-red-950/50 border-b border-red-700/40 text-red-400'
                    }`}>
                    <span>
                        <span className={submitFeedback.type === 'success' ? 'text-green-600' : 'text-red-600'}>
                            [{submitFeedback.type === 'success' ? 'SUCCESS' : 'FAILED'}]:
                        </span>{' '}
                        {submitFeedback.msg}
                    </span>
                    <button
                        onClick={() => setSubmitFeedback(null)}
                        className="text-green-800 hover:text-green-400 transition-colors text-lg leading-none"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden min-h-0">

                {/* Left Pane: Log Viewer */}
                <div className="w-1/2 h-full">
                    <LogViewer
                        originalData={corruptedLog}
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
                answer={answer}
                onAnswerChange={setAnswer}
                hint={levelMeta.hint}
            />
        </div>
    )
}
