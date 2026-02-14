import { useEffect } from 'react'
import { X, Target, BookOpen, Code2, Trophy } from 'lucide-react'

export default function HelpModal({ onClose }) {
    // Close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    return (
        <div
            className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/85 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto border border-green-800/60 bg-gray-950/95 shadow-[0_0_40px_rgba(0,255,65,0.1)] mx-4 animate-boot">
                {/* Noise overlay */}
                <div className="noise-overlay" />

                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-green-500/40" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-green-500/40" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-green-500/40" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-green-500/40" />

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-green-700 hover:text-green-400 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 space-y-8 relative">
                    {/* Title */}
                    <div className="text-center">
                        <h2 className="text-xl font-bold tracking-[0.3em] text-green-400 text-glow-strong">
                            ▓▓ OPERATOR MANUAL ▓▓
                        </h2>
                        <p className="text-[10px] text-green-800 tracking-widest mt-1">
                            CLEARANCE_LEVEL::PUBLIC // DOCUMENT_ID::HELP_001
                        </p>
                    </div>

                    {/* ═══ Section 1: Mission Briefing ═══ */}
                    <Section
                        icon={<Target className="w-4 h-4" />}
                        title="MISSION BRIEFING"
                        delay="1"
                    >
                        <p className="text-green-500/80 text-sm leading-relaxed">
                            You are a <span className="text-green-300 font-bold">systems recovery operator</span>.
                            A black box flight recorder has been recovered, but the data is
                            <span className="text-red-400"> corrupted with noise, garbled sectors, and malformed entries</span>.
                        </p>
                        <p className="text-green-500/80 text-sm leading-relaxed mt-2">
                            Your objective: <span className="text-green-300 font-bold">write Python scripts</span> to
                            parse through the corrupted data, clean it, and <span className="text-green-300 font-bold">identify
                                the anomaly</span> hidden within each level's log file.
                        </p>
                    </Section>

                    {/* ═══ Section 2: How to Operate ═══ */}
                    <Section
                        icon={<BookOpen className="w-4 h-4" />}
                        title="HOW TO OPERATE"
                        delay="2"
                    >
                        <div className="space-y-2">
                            {[
                                ['01', 'READ the corrupted log data in the left panel — it tells a story with data embedded in it'],
                                ['02', 'WRITE a Python script in the editor (right panel) to parse and clean the data'],
                                ['03', 'CLICK "RUN SCRIPT" — your code runs in-browser'],
                                ['04', 'ANALYZE the terminal output to find the anomaly'],
                                ['05', 'TYPE your answer as a sentence explaining WHAT went wrong and WHEN/WHY it happened'],
                                ['06', 'CLICK "SUBMIT" — the button only activates after you run a script'],
                            ].map(([num, text]) => (
                                <div key={num} className="flex items-start gap-3">
                                    <span className="text-green-700 text-xs font-bold shrink-0 w-6 text-right">[{num}]</span>
                                    <span className="text-green-500/80 text-sm">{text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 p-2 border border-green-900/30 bg-green-950/20 text-xs text-green-600 tracking-wider">
                            TIP: The variable <code className="text-green-400 bg-black/50 px-1">raw_log_data</code> is
                            pre-loaded with the log contents. Just use it directly in your script.
                        </div>
                        <div className="mt-2 p-2 border border-yellow-900/30 bg-yellow-950/10 text-xs text-yellow-600 tracking-wider">
                            ⚠ IMPORTANT: The SUBMIT button is <span className="text-yellow-400 font-bold">disabled</span> until
                            you run your script at least once. Run your code first, then submit your answer.
                        </div>
                    </Section>

                    {/* ═══ Section 3: How to Answer ═══ */}
                    <Section
                        icon={<Code2 className="w-4 h-4" />}
                        title="HOW TO ANSWER"
                        delay="3"
                    >
                        <div className="p-3 border border-green-900/40 bg-green-950/20 mb-4">
                            <p className="text-green-400 text-sm font-bold tracking-wider mb-2">YOUR ANSWER SHOULD BE A SENTENCE, NOT JUST A NUMBER.</p>
                            <p className="text-green-500/80 text-sm leading-relaxed">
                                Describe <span className="text-green-300 font-bold">what went wrong</span> and{' '}
                                <span className="text-green-300 font-bold">when/where it happened</span>. The system checks
                                that your answer covers at least <span className="text-green-300 font-bold">two different aspects</span>{' '}
                                of the anomaly (ex: the component AND the timestamp, or the failure type AND the cause).
                            </p>
                        </div>

                        <p className="text-green-600 text-xs tracking-wider mb-3">
                            ▸ EXAMPLE SCENARIO: A motor overheated at timestamp 1005.
                        </p>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="text-green-400 text-sm">✓</span>
                                <span className="text-green-400 text-sm font-bold">GOOD ANSWERS (accepted):</span>
                            </div>
                            <div className="pl-6 space-y-2 text-sm">
                                <div>
                                    <code className="bg-black/50 px-1 text-green-300">"The motor temperature spiked at T:1005"</code>
                                    <span className="text-green-700 text-xs ml-2">— covers WHAT + WHEN</span>
                                </div>
                                <div>
                                    <code className="bg-black/50 px-1 text-green-300">"Thermal anomaly in the motor caused a shutdown"</code>
                                    <span className="text-green-700 text-xs ml-2">— covers WHAT + WHERE</span>
                                </div>
                                <div>
                                    <code className="bg-black/50 px-1 text-green-300">"Motor overheated at 1005, voltage dropped to zero"</code>
                                    <span className="text-green-700 text-xs ml-2">— covers WHERE + WHEN + HOW</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-3">
                                <span className="text-red-400 text-sm">✗</span>
                                <span className="text-red-400 text-sm font-bold">BAD ANSWERS (rejected):</span>
                            </div>
                            <div className="pl-6 space-y-2 text-sm">
                                <div>
                                    <code className="bg-black/50 px-1 text-red-400/70">"1005"</code>
                                    <span className="text-red-700 text-xs ml-2">— too short, only covers WHEN</span>
                                </div>
                                <div>
                                    <code className="bg-black/50 px-1 text-red-400/70">"something went wrong"</code>
                                    <span className="text-red-700 text-xs ml-2">— too vague, doesn't mention specifics</span>
                                </div>
                                <div>
                                    <code className="bg-black/50 px-1 text-red-400/70">"motor"</code>
                                    <span className="text-red-700 text-xs ml-2">— too short, only covers WHERE</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 p-2 border border-cyan-900/30 bg-cyan-950/10 text-xs text-cyan-600 tracking-wider">
                            💡 THINK OF IT THIS WAY: If a friend asked you "What happened?", give
                            them enough detail that they'd understand. Mention the <span className="text-cyan-400">component</span>,
                            the <span className="text-cyan-400">timestamp</span>, or the <span className="text-cyan-400">type of failure</span> — at least two of these.
                        </div>
                    </Section>

                    {/* ═══ Section 4: Rules ═══ */}
                    <Section
                        icon={<Trophy className="w-4 h-4" />}
                        title="RULES OF ENGAGEMENT"
                        delay="4"
                    >
                        <div className="space-y-3">
                            <Rule
                                num="01"
                                title="AI IS ALLOWED"
                                desc="You may use AI tools (ChatGPT, Copilot, etc.) to help write your Python scripts."
                                color="yellow"
                            />
                            <Rule
                                num="02"
                                title="TIME IS SCORE"
                                desc="A timer starts when each level loads. The faster you solve it, the more points you earn. Don't rush blindly though — wrong submissions don't cost time, but they don't stop the clock either."
                                color="green"
                            />
                            <Rule
                                num="03"
                                title="SCORING FORMULA"
                                desc="Points = max(100, 1000 − seconds_elapsed × 2). Solve in under a second? 1000 pts. Take 7+ minutes? You still get 100 pts. Points accumulate across all levels."
                                color="green"
                            />
                            <Rule
                                num="04"
                                title="NO SHARING"
                                desc="Do not share answers or scripts with other operators during the event. Each operator works independently."
                                color="red"
                            />
                        </div>
                    </Section>

                    {/* Footer */}
                    <div className="text-center text-[10px] text-green-900/50 tracking-widest pt-2 border-t border-green-900/20">
                        PRESS ESC OR CLICK OUTSIDE TO CLOSE // GOOD LUCK, OPERATOR
                    </div>
                </div>
            </div>
        </div>
    )
}

function Section({ icon, title, delay, children }) {
    return (
        <div className={`animate-boot animate-boot-delay-${delay}`}>
            <div className="flex items-center gap-2 mb-3">
                <span className="text-green-500">{icon}</span>
                <h3 className="text-sm font-bold tracking-[0.2em] text-green-400 text-glow">
                    {title}
                </h3>
                <div className="flex-1 h-px bg-green-900/30" />
            </div>
            <div className="pl-6">
                {children}
            </div>
        </div>
    )
}

function Rule({ num, title, desc, color }) {
    const colorMap = {
        green: 'text-green-400 border-green-900/30',
        yellow: 'text-yellow-400 border-yellow-900/30',
        red: 'text-red-400 border-red-900/30',
    }
    const accent = colorMap[color] || colorMap.green

    return (
        <div className={`flex items-start gap-3 p-2 border-l-2 ${accent.split(' ')[1]}`}>
            <span className="text-green-700 text-xs font-bold shrink-0">[{num}]</span>
            <div>
                <span className={`text-sm font-bold tracking-wider ${accent.split(' ')[0]}`}>{title}: </span>
                <span className="text-green-500/80 text-sm">{desc}</span>
            </div>
        </div>
    )
}
