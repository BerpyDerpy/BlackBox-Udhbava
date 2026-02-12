# BlackBox Udhbava


This repository houses the frontend interface for our coding event, where contestants put their logical thinking and scripting skills to the test. It's a sleek, dark-themed web environment designed to let participants focus on one thing: cracking the code.

## What is this?

Think of this as the cockpit for the event. Participants log in with their roll numbers and are immediately thrust into the challenge. They are presented with BlackBox text files: mysterious encoded data that needs deciphering. To help them, we've integrated a full-featured code editor right in the browser.

## Key Features

- **Instant Access**: Simple login via Supabase ensures legitimate participants can jump straight in.
- **he BlackBox**: Direct visualization of the puzzle files they need to decode.
- **Integrated IDE**: We've baked in the **Monaco Editor** (the same engine that powers VS Code). It supports syntax highlighting for **JavaScript, Python, Java, and C++**, so participants can work in their language of choice.
- **Live Execution**: Contestants can run their scripts on the fly to test logic against the blackbox data.
- **Auto-Save & History**: A basic undo history keeps their code safe from accidental deletions.

## Under the Hood

- **Frontend**: Plain HTML5, CSS3, and Vanilla JavaScript. Fast, lightweight, and no build steps required.
- **Styling**: Custom CSS with a modern "Glassmorphism" aesthetic—dark modes, blurs, and neon accents.
- **Database**: **Supabase** handles user authentication and score tracking.
- **Backend Communication**: The app talks to a separate backend service (running locally or deployed elsewhere) to execute code safely and validate submissions.


---
