// ═══════════════════════════════════════════════════════
// LEVEL 1  —  EASY: Simple temperature spike detection
// Clear log format, minimal noise, one obvious anomaly
// ═══════════════════════════════════════════════════════
export const LEVEL_1_LOG = `[LOG_START]
##NOISE## BOOT_SEQ...0x0F2A
T:1001|SENSOR:TEMP|VAL:22|STATUS:OK
T:1002|SENSOR:TEMP|VAL:23|STATUS:OK
T:1003|SENSOR:TEMP|VAL:22|STATUS:OK
T:1004|SENSOR:TEMP|VAL:24|STATUS:OK
T:1005|SENSOR:TEMP|VAL:95|STATUS:CRITICAL
T:1006|SENSOR:TEMP|VAL:23|STATUS:OK
T:1007|SENSOR:TEMP|VAL:22|STATUS:OK
@@NOISE@@ ...checksum...0xFF
[LOG_END]`

export const LEVEL_1_ANSWER = 'T:1005'

// ═══════════════════════════════════════════════════════
// LEVEL 2  —  MEDIUM: Multi-sensor failure identification
// Multiple sensor types, more noise, need to find which
// sensor had a cascading failure
// ═══════════════════════════════════════════════════════
export const LEVEL_2_LOG = `[SYS_BOOT]::0xAF32..INIT
##GARBLED## ..noise_burst.. %%!!
T:2001|SENSOR:PRESSURE|VAL:101.3|UNIT:kPa|STATUS:OK
T:2002|SENSOR:GYRO|VAL:0.02|UNIT:deg/s|STATUS:OK
T:2003|SENSOR:PRESSURE|VAL:101.5|UNIT:kPa|STATUS:OK
$$CORRUPT$$ ..packet_loss.. &&**
T:2004|SENSOR:GYRO|VAL:0.01|UNIT:deg/s|STATUS:OK
T:2005|SENSOR:PRESSURE|VAL:340.7|UNIT:kPa|STATUS:WARNING
T:2006|SENSOR:GYRO|VAL:45.8|UNIT:deg/s|STATUS:CRITICAL
T:2007|SENSOR:PRESSURE|VAL:450.2|UNIT:kPa|STATUS:CRITICAL
@@FRAG@@ ..data_loss.. !!##
T:2008|SENSOR:GYRO|VAL:89.3|UNIT:deg/s|STATUS:CRITICAL
T:2009|SENSOR:PRESSURE|VAL:102.0|UNIT:kPa|STATUS:OK
T:2010|SENSOR:GYRO|VAL:0.05|UNIT:deg/s|STATUS:OK
[SYS_HALT]::EMERGENCY_STOP`

export const LEVEL_2_ANSWER = 'GYRO'

// ═══════════════════════════════════════════════════════
// LEVEL 3  —  HARD: Interleaved multi-system anomaly
// Heavy corruption, encoded values, multiple anomalies
// across different subsystems to correlate
// ═══════════════════════════════════════════════════════
export const LEVEL_3_LOG = `[BLACKBOX_v3.2]::RECOVERY_MODE
!!WARN!! FILESYSTEM_DAMAGED..PARTIAL_READ
%%FRAG%%..0x00..0x00..0xFF
SYS:NAV|T:3001|LAT:28.6139|LON:77.2090|ALT:10200|STAT:NOMINAL
SYS:ENG|T:3001|RPM:2400|FUEL:82%|TEMP:340|STAT:OK
SYS:COM|T:3001|FREQ:121.5|SNR:45dB|STAT:CLEAR
&&CORRUPT&&..missing_packets..##!!
SYS:NAV|T:3002|LAT:28.6140|LON:77.2091|ALT:10200|STAT:NOMINAL
SYS:ENG|T:3002|RPM:2380|FUEL:81%|TEMP:345|STAT:OK
SYS:COM|T:3002|FREQ:121.5|SNR:44dB|STAT:CLEAR
$$NOISE$$..burst..%%
SYS:NAV|T:3003|LAT:28.6141|LON:77.2091|ALT:10198|STAT:NOMINAL
SYS:ENG|T:3003|RPM:2350|FUEL:80%|TEMP:355|STAT:OK
SYS:COM|T:3003|FREQ:121.5|SNR:12dB|STAT:DEGRADED
@@FRAG@@..0xDEAD..0xBEEF
SYS:NAV|T:3004|LAT:28.6145|LON:77.2085|ALT:9800|STAT:DEVIATION
SYS:ENG|T:3004|RPM:3200|FUEL:78%|TEMP:510|STAT:WARNING
SYS:COM|T:3004|FREQ:121.5|SNR:3dB|STAT:LOST
##CRITICAL##..cascade_failure..!!
SYS:NAV|T:3005|LAT:28.6160|LON:77.2070|ALT:8500|STAT:CRITICAL
SYS:ENG|T:3005|RPM:4100|FUEL:75%|TEMP:680|STAT:CRITICAL
SYS:COM|T:3005|FREQ:000.0|SNR:0dB|STAT:OFFLINE
%%EMERGENCY%%..MAYDAY..MAYDAY
SYS:NAV|T:3006|LAT:28.6180|LON:77.2050|ALT:6200|STAT:CRITICAL
SYS:ENG|T:3006|RPM:0|FUEL:74%|TEMP:0|STAT:OFFLINE
[BLACKBOX_END]::IMPACT_DETECTED`

export const LEVEL_3_ANSWER = 'T:3004'

// ═══════════════════════════════════════════════════════
// Lookup helpers
// ═══════════════════════════════════════════════════════
export const LEVEL_DATA = {
    1: { log: LEVEL_1_LOG, answer: LEVEL_1_ANSWER, label: 'EASY', hint: 'Identify the timestamp of the anomalous reading' },
    2: { log: LEVEL_2_LOG, answer: LEVEL_2_ANSWER, label: 'MEDIUM', hint: 'Identify which sensor experienced cascading failure' },
    3: { log: LEVEL_3_LOG, answer: LEVEL_3_ANSWER, label: 'HARD', hint: 'Identify the timestamp when the cascade failure began' },
}

export const MOCK_TERMINAL_WELCOME = `> BLACK BOX OS v1.0.4
> INITIALIZING RECOVERY MODE...
> ERROR: LOG FILE CORRUPTED.
> AWAITING MANUAL INTERVENTION.
`
