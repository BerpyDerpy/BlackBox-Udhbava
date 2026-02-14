// ═══════════════════════════════════════════════════════
// Level metadata — log content lives in public/levels/
// ═══════════════════════════════════════════════════════

export const LEVEL_META = {
    1: {
        file: '/levels/level_1_easy.txt',
        label: 'EASY',
        hint: 'Strip the noise, extract the values, and find the timestamp of the thermal spike.',
        keywords: ['1404', '1405', 'temp', 'temperature', 'motor'],
    },
    2: {
        file: '/levels/level_2_medium.txt',
        label: 'MEDIUM',
        hint: 'Decode the hexadecimal payloads and graph or calculate the delta between the two values to find the physical anomaly.',
        keywords: ['oscillation', 'resonance', 'instability', 'pogo', '1.500', '1.5'],
    },
    3: {
        file: '/levels/level_3_hard_v2.txt',
        label: 'HARD',
        hint: 'Filter for the ALPHA unit and mathematically compare its local telemetry timestamps against the main server timestamps.',
        keywords: ['drift', 'desync', 'clock', 'time', 'sync', 'synchronization'],
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
// Keyword-based answer checker
// The user's answer (natural language) must contain
// at least one of the level's keywords.
// ═══════════════════════════════════════════════════════
export function checkAnswer(userAnswer, levelNum) {
    const meta = LEVEL_META[levelNum]
    if (!meta) return false

    const normalised = userAnswer.trim().toLowerCase()
    return meta.keywords.some(kw => normalised.includes(kw.toLowerCase()))
}

// ═══════════════════════════════════════════════════════
// Terminal welcome banner
// ═══════════════════════════════════════════════════════
export const MOCK_TERMINAL_WELCOME = `> BLACK BOX OS v1.0.4
> INITIALIZING RECOVERY MODE...
> ERROR: LOG FILE CORRUPTED.
> AWAITING MANUAL INTERVENTION.
`
