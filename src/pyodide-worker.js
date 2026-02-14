// specific pyodide-worker.js
importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js");

async function loadPyodideAndPackages() {
    self.pyodide = await loadPyodide();
    self.postMessage({ type: 'READY' });
}

let pyodideReadyPromise = loadPyodideAndPackages();

self.onmessage = async (event) => {
    // Make sure loading is done
    await pyodideReadyPromise;

    const { pythonCode, rawLogData } = event.data;

    try {
        // 1. Set global variable for the script to access
        self.pyodide.globals.set("raw_log_data", rawLogData);

        // 2. Redirect stdout
        self.pyodide.runPython(`
import sys
import io
sys.stdout = io.StringIO()
    `);

        // 3. Run the user's code
        await self.pyodide.loadPackagesFromImports(pythonCode);
        let result = await self.pyodide.runPythonAsync(pythonCode);

        // 4. Get stdout
        let stdout = self.pyodide.runPython("sys.stdout.getvalue()");

        // 5. Send back
        self.postMessage({
            type: 'SUCCESS',
            stdout: stdout,
            result: result
        });

    } catch (error) {
        self.postMessage({
            type: 'ERROR',
            error: error.message
        });
    }
};
