// ═══════════════════════════════════════════════════════
// Level metadata — log content lives in public/levels/
// Answer validation uses concept-group matching:
// The user's answer must cover ≥2 different concept
// groups to be accepted. This encourages explanation
// over single-word guesses.
// ═══════════════════════════════════════════════════════

export const LEVEL_META = {
    1: {
        file: '/levels/level_1_easy.txt',
        label: 'EASY',
        hint: 'Parse the telemetry, strip the noise, and explain WHAT went wrong and WHEN. Your answer should describe the anomaly — not just a number.',
        // Concept groups: [WHEN, WHAT, WHERE, HOW]
        concepts: [
            ['1404', '1405'],                                           // WHEN — timestamp of the spike
            ['temp', 'thermal', 'temperature', 'overheat', 'hot', 'heat'], // WHAT — thermal event
            ['motor', 'engine', 'drive'],                               // WHERE — component
            ['spike', 'surge', 'jump', 'anomaly', 'failure', 'shutdown', 'critical', 'voltage'], // HOW — behavior
        ],
        minConcepts: 2,  // must hit at least 2 groups
    },
    2: {
        file: '/levels/level_2_medium_v2.txt',
        label: 'MEDIUM',
        hint: 'Individual INLET_P readings are useless — the sensor is broken. But the REAL pressure is hidden under all that noise. Try averaging groups of readings to reveal the true trend. The pump specs are in the log header. What critical threshold was crossed, and when?',
        // Concept groups: [WHEN, WHAT, METHOD, RESULT]
        concepts: [
            ['10', '10.0', '10.00', '10.000', 't+10'],                // WHEN — approximate threshold crossing time
            ['pressure', 'inlet', 'psi', 'inlet_p'],                  // WHAT — the measurement
            ['filter', 'average', 'moving average', 'smooth', 'window'], // METHOD — how they solved it
            ['cavitation', '300', 'threshold', 'destruction', 'pump'],  // RESULT — the consequence
        ],
        minConcepts: 2,
    },
    3: {
        file: '/levels/level_3_hard_v2.txt',
        label: 'HARD',
        hint: 'Something is different about ALPHA\'s packets vs BRAVO\'s. Look very carefully at the timestamps in each packet — t_local vs SYS_TS. What pattern do you see? Why would the system stop trusting a drone\'s data?',
        // Concept groups: [WHAT, CAUSE, MECHANISM, EFFECT]
        concepts: [
            ['drift', 'desync', 'desynchronization', 'out of sync', 'offset', 'skew'], // WHAT — the issue
            ['clock', 'time', 'timestamp', 'oscillator', 't_local', 'sys_ts'],          // CAUSE — clock-related
            ['0.001', 'cumulative', 'per tick', 'per packet', 'gradual', 'growing'],     // MECHANISM — how it happens
            ['reject', 'stale', 'tolerance', '5 second', '5.0', 'collision', 'avoidance'], // EFFECT — consequences
        ],
        minConcepts: 2,
    },
};

export const TOTAL_LEVELS = Object.keys(LEVEL_META).length

// ═══════════════════════════════════════════════════════
// Async loader — fetches .txt from public/levels/
// ═══════════════════════════════════════════════════════
export async function loadLevelLog(levelNum) {
    const meta = LEVEL_META[levelNum]
    if (!meta) return null

    const resp = await fetch(meta.file)
    if (!resp.ok) throw new Error(`Failed to load level ${levelNum}`)
    return resp.text()
}

// ═══════════════════════════════════════════════════════
// Concept-group answer checker
// The user's answer (natural language) must cover at
// least `minConcepts` different concept groups. Each
// group represents a semantic category (WHEN, WHAT, etc.)
// ═══════════════════════════════════════════════════════
export function checkAnswer(userAnswer, levelNum) {
    const meta = LEVEL_META[levelNum]
    if (!meta) return false

    const normalised = userAnswer.trim().toLowerCase()
    if (normalised.length < 10) return false  // reject trivially short answers

    const groupsHit = meta.concepts.filter(group =>
        group.some(term => normalised.includes(term.toLowerCase()))
    )

    return groupsHit.length >= (meta.minConcepts || 2)
}

// ═══════════════════════════════════════════════════════
// Terminal welcome banner
// ═══════════════════════════════════════════════════════
export const MOCK_TERMINAL_WELCOME = `> BLACK BOX OS v1.0.4
> INITIALIZING RECOVERY MODE...
> ERROR: LOG FILE CORRUPTED.
> AWAITING MANUAL INTERVENTION.
`
