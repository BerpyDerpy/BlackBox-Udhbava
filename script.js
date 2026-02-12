const supabaseUrl = 'https://fdhthsgpoeedztydwxai.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkaHRoc2dwb2VlZHp0eWR3eGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MDc4MjMsImV4cCI6MjA4NjM4MzgyM30.ZX43HOyBNZDpbrxTnpGl7rruu8ngVwVzQMehnDqysJI';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

let editor;
let _history = []; // simple stack of previous code versions

function pushHistory(code) {
  try {
    if (typeof code !== 'string') return;
    _history.push(code);
    // limit history size
    if (_history.length > 50) _history.shift();
    updateUndoButton();
  } catch (e) { /* ignore */ }
}

function updateUndoButton() {
  const btn = document.getElementById('undo-btn');
  if (!btn) return;
  btn.disabled = _history.length === 0;
}

function undoEdit() {
  if (_history.length === 0) return;
  const prev = _history.pop();
  // set editor or textarea
  if (editor && typeof editor.setValue === 'function') {
    editor.setValue(prev);
  } else {
    const ta = document.getElementById('script');
    if (ta) ta.value = prev;
  }
  updateUndoButton();
}

async function login() {
  const rollno = document.getElementById('rollno').value.trim();
  if (rollno) {
    try {
      // Insert or upsert user in Supabase
      const { data, error } = await supabase
        .from('users')
        .upsert({ rollno: rollno }, { onConflict: 'rollno' });

      if (error) throw error;

      localStorage.setItem('rollno', rollno);
      // show question page first (open blackbox)
      document.getElementById('login').style.display = 'none';
      document.getElementById('question').style.display = 'flex';
      loadBlackBox('blackbox1.txt');
    } catch (e) {
      alert('Login Error: ' + e.message);
    }
  }
}

function enterIDE() {
  document.getElementById('question').style.display = 'none';
  document.getElementById('ide').style.display = 'flex';
  const rollno = localStorage.getItem('rollno');
  const userRoll = document.getElementById('user-rollno');
  if (userRoll && rollno) userRoll.textContent = rollno;
  // initialize editor after a short delay so layout stabilizes
  setTimeout(initEditor, 300);
}

async function loadBlackBox(filename = 'blackbox1.txt') {
  try {
    const res = await fetch(filename);
    if (!res.ok) throw new Error('Not found');
    const txt = await res.text();
    const el = document.getElementById('blackbox');
    const el2 = document.getElementById('blackbox-in-ide');
    if (el) el.textContent = txt;
    if (el2) el2.textContent = txt;
  } catch (e) {
    const el = document.getElementById('blackbox');
    const el2 = document.getElementById('blackbox-in-ide');
    if (el) el.textContent = 'Unable to load question.';
    if (el2) el2.textContent = 'Unable to load question.';
  }
}

function changeBlackBoxFile() {
  const file = document.getElementById('file-select').value;
  loadBlackBox(file);
}

// function initEditor() {
//   // require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.55.1/min/vs' } });
//   require.config({
//   paths: {
//     vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
//   }
//   });
//   require(['vs/editor/editor.main'], () => {
//     editor = monaco.editor.create(document.getElementById('editor'), {
//       value: document.getElementById('script').value,
//       language: 'javascript',
//       theme: 'vs-dark',
//       fontSize: 14,
//       minimap: { enabled: false },
//       scrollBeyondLastLine: false
//     });

//     const scriptTextarea = document.getElementById('script');
//     scriptTextarea.addEventListener('input', (e) => {
//       editor.setValue(e.target.value);
//     });

//     // Sync Monaco back to textarea (optional)
//     editor.onDidChangeModelContent(() => {
//       scriptTextarea.value = editor.getValue();
//     });
//   });
//   console.log("✅ Monaco editor initialized");
// }

function initEditor() {
  window.MonacoEnvironment = {
    getWorkerUrl: function () {
      return `
        data:text/javascript;charset=utf-8,
        self.MonacoEnvironment = { baseUrl: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/' };
        importScripts('https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/base/worker/workerMain.js');
      `;
    }
  };

  require.config({
    paths: {
      vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
    }
  });

  require(['vs/editor/editor.main'], function () {
    const languageSelect = document.getElementById('language-select');
    const selectedLanguage = languageSelect ? languageSelect.value : 'javascript';

    editor = monaco.editor.create(document.getElementById('editor'), {
      value: document.getElementById('script').value,
      language: selectedLanguage,
      theme: 'vs-dark',
      fontSize: 14,
      minimap: { enabled: false }
    });

    if (languageSelect) {
      languageSelect.addEventListener('change', (e) => {
        monaco.editor.setModelLanguage(editor.getModel(), e.target.value);
      });
    }

    // track changes for undo: push previous snapshot (debounced)
    function debounce(fn, ms = 400) {
      let t;
      return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
    }

    let lastSnapshot = editor.getValue();
    const maybePush = debounce(() => { pushHistory(lastSnapshot); lastSnapshot = editor.getValue(); }, 700);
    editor.onDidChangeModelContent(() => {
      maybePush();
      // also keep textarea synced
      const scriptTextarea = document.getElementById('script');
      if (scriptTextarea) scriptTextarea.value = editor.getValue();
    });

    // Sync textarea -> editor when textarea is used
    const scriptTextarea = document.getElementById('script');
    if (scriptTextarea) {
      let lastTa = scriptTextarea.value;
      const taMaybePush = debounce(() => { pushHistory(lastTa); lastTa = scriptTextarea.value; }, 700);
      scriptTextarea.addEventListener('input', () => {
        if (editor) editor.setValue(scriptTextarea.value);
        taMaybePush();
      });
    }

    console.log("✅ Monaco editor loaded successfully");
    updateUndoButton();
  });
}


// function runCode() {
//   const code = editor ? editor.getValue() : document.getElementById('script').value;

//   try {
//     // Create iframe sandbox for safe execution (no UI feedback)
//     const iframe = document.createElement('iframe');
//     iframe.style.display = 'none';
//     document.body.appendChild(iframe);

//     const iframeWin = iframe.contentWindow;
//     iframeWin.eval(code);

//     document.body.removeChild(iframe);
//     console.log('✅ Code executed successfully');
//   } catch (error) {
//     console.error('❌ Run error:', error.message);
//     document.body.removeChild(iframe);
//   }
// }

async function runCode() {
  const rollno = localStorage.getItem("rollno");

  if (!editor) {
    alert("Editor is still loading. Please wait a second.");
    return;
  }

  const code = editor.getValue();
  const language = document.getElementById('language-select').value;

  try {
    const res = await fetch("http://localhost:5000/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rollno, code, language })
    });

    const data = await res.json();

    if (data.success) {
      document.getElementById('output').textContent = "Output:\n" + data.output;
      const bres = document.getElementById('blackbox-result');
      if (bres) bres.textContent = data.output || '';
    } else {
      document.getElementById('output').innerHTML = "Error:\n" + data.error;
      const bres = document.getElementById('blackbox-result');
      if (bres) bres.textContent = data.error || '';
    }
  } catch (err) {
    document.getElementById('output').innerHTML = "Backend not reachable";
    const bres = document.getElementById('blackbox-result');
    if (bres) bres.textContent = 'Backend not reachable';
  }
  console.log("Editor value:", editor?.getValue());
}


// function submitAnswer() {
//   const rollno = localStorage.getItem('rollno');
//   const answer = document.getElementById('answer').value.trim();
//   const code = editor.getValue();

//   console.log('Submission:', { rollno, code, answer });
//   alert(`✅ Submitted by ${rollno}\nAnswer: ${answer}`);
//   document.getElementById('answer').value = '';
// }

async function submitAnswer() {
  const rollno = localStorage.getItem("rollno");
  const code = editor.getValue();
  const answer = document.getElementById("answer").value;

  if (!answer) {
    alert("Please enter your answer");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rollno, code, answer })
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Submission successful");
      //window.location.href = "http://127.0.0.1:5500/frontend/index.html";
    } else {
      alert("Submission failed");
    }
  } catch (err) {
    alert("Backend not reachable");
  }
}
