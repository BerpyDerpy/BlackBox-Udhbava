// ═══════════════════════════════════════════════════════
// Level metadata — log content lives in public/levels/
// ═══════════════════════════════════════════════════════

export const LEVEL_META = {
    1: {
        file: '/levels/level1.txt',
        label: 'EASY',
        hint: 'Identify the timestamp of the anomalous reading',
        keywords: ['t:1005', '1005', 'hydraulic'],
    },
    2: {
        file: '/levels/level2.txt',
        label: 'MEDIUM',
        hint: 'Identify which sensor experienced cascading failure',
        keywords: ['gyro', 'gyroscope'],
    },
    3: {
        file: '/levels/level3.txt',
        label: 'HARD',
        hint: 'Identify the timestamp when the cascade failure began',
        keywords: ['t:3004', '3004'],
    },
}

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
