import Editor from '@monaco-editor/react'

export default function CodeEditor({ code, onChange }) {
    return (
        <div className="h-full w-full bg-black">
            <div className="flex items-center justify-between p-2 border-b border-green-900 bg-black">
                <span className="text-xs uppercase font-bold tracking-wider text-green-600">
                    script.py
                </span>
                <span className="text-[10px] text-gray-500">PYTHON 3.8 ENV</span>
            </div>
            <Editor
                height="100%"
                defaultLanguage="python"
                defaultValue={code}
                theme="vs-dark"
                options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    fontFamily: "'Fira Code', monospace",
                    cursorBlinking: "smooth",
                    lineNumbers: "on",
                    renderLineHighlight: "all",
                    automaticLayout: true,
                }}
                onChange={onChange}
            />
        </div>
    )
}
