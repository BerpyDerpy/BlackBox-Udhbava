let editor;

function login() {
  const rollno = document.getElementById('rollno').value.trim();
  if (rollno) {
    localStorage.setItem('rollno', rollno);
    document.getElementById('login').style.display = 'none';
    document.getElementById('ide').style.display = 'flex';
    document.getElementById('user-rollno').textContent = rollno;
    setTimeout(initEditor, 300);
  }
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

    console.log("✅ Monaco editor loaded successfully");
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
    } else {
      document.getElementById('output').innerHTML = "Error:\n" + data.error;
    }
  } catch (err) {
    document.getElementById('output').innerHTML = "Backend not reachable";
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

