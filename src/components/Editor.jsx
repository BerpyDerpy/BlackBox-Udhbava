import Editor from '@monaco-editor/react'

export default function CodeEditor({ code, onChange }) {
    return (
        <div className="h-full w-full bg-black overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-green-900/40 bg-black shrink-0">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-600/60" />
                    <span className="text-xs uppercase font-bold tracking-[0.15em] text-green-500 text-glow">
                        script.py
                    </span>
                </div>
                <span className="text-[10px] text-green-800 tracking-wider">PYTHON 3.11 ENV</span>
            </div>
            <div className="flex-1 min-h-0">
                <Editor
                    height="100%"
                    defaultLanguage="python"
                    defaultValue={code}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                        fontLigatures: true,
                        cursorBlinking: "smooth",
                        cursorSmoothCaretAnimation: "on",
                        lineNumbers: "on",
                        renderLineHighlight: "all",
                        automaticLayout: true,
                        padding: { top: 8, bottom: 8 },
                        smoothScrolling: true,
                    }}
                    onChange={onChange}
                />
            </div>
        </div>
    )
}
