import random
import math
import json

def generate_easy_log():
    """Level 1: Mars Rover Thermal Failure — Narrative + Data
    
    Spoilers REMOVED: No "YOUR TASK" block, no post-incident explanation.
    The log just ends with the shutdown. The story tells itself.
    """
    print("Generating Level 1: Easy (Narrative)...")
    with open("public/levels/level_1_easy.txt", "w") as f:
        f.write("╔══════════════════════════════════════════════════════════════════╗\n")
        f.write("║  MARS EXPLORATION PROGRAM — ROVER 'PATHKEEPER' INCIDENT REPORT ║\n")
        f.write("║  MISSION SOL: 847 | SECTOR: VALLES MARINERIS EAST              ║\n")
        f.write("║  STATUS: ■■ CRITICAL FAILURE — INVESTIGATION REQUIRED ■■       ║\n")
        f.write("╚══════════════════════════════════════════════════════════════════╝\n")
        f.write("\n")
        f.write("[MISSION CONTROL — TRANSCRIPT BEGIN]\n")
        f.write("[MC-CHEN]: Pathkeeper, this is Houston. We're uploading the traverse\n")
        f.write("          route for today. 4km across the basin floor. Standard recon.\n")
        f.write("[PATHKEEPER-AI]: Acknowledged. All systems nominal. Beginning traverse.\n")
        f.write("\n")
        f.write("--- BEGIN TELEMETRY STREAM (T:1000 — onward) ---\n")
        f.write("--- FORMAT: T:<timestamp> | SPD:<km/h> | MOTOR_TEMP:<°C> | V:<volts> | LIDAR:<status> ---\n")
        f.write("--- NOTE: Telemetry corrupted by dust-storm interference. Delimiters inconsistent. ---\n")
        f.write("\n")
        
        temp = 45
        for t in range(1000, 1500):
            noise = "".join(random.choices("!@#$%^&*()", k=random.randint(2, 5)))
            delim1 = random.choice(["|", ";", ","])
            delim2 = random.choice(["|", ";", ","])
            
            # Narrative beats at key timestamps — no spoilers, just observations
            if t == 1100:
                f.write("\n[MC-CHEN]: Pathkeeper, you're one klick in. How's the terrain?\n")
                f.write("[PATHKEEPER-AI]: Regolith is loose but manageable. Motor temps stable.\n")
                f.write("[MC-CHEN]: Copy. Keep an eye on that left drive motor — it ran hot last sol.\n\n")
            elif t == 1200:
                f.write("\n[OPERATOR NOTE — T:1200]: Halfway through the basin. All readings nominal.\n")
                f.write("[OPERATOR NOTE]: Dust interference increasing. Some telemetry may be garbled.\n\n")
            elif t == 1300:
                f.write("\n[MC-CHEN]: Pathkeeper, I'm watching the numbers but this dust isn't helping.\n")
                f.write("           Just... keep us posted on anything unusual.\n")
                f.write("[PATHKEEPER-AI]: Acknowledged. Continuing traverse.\n\n")
            elif t == 1380:
                f.write("\n[MC-CHEN]: Wait— something's off. Let me pull up the last few readings.\n")
                f.write("[HARRIS]: What are you seeing?\n")
                f.write("[MC-CHEN]: I'm not sure yet. Could be nothing.\n")
                f.write("[HARRIS]: Flag it. Keep watching.\n\n")
            elif t == 1400:
                f.write("\n[MC-CHEN]: Harris, I don't like this.\n")
                f.write("[HARRIS]: Is it the terrain?\n")
                f.write("[MC-CHEN]: Negative. Speed is constant. Something else.\n")
                f.write("[HARRIS]: Stand by for possible halt command.\n\n")
            
            if t == 1404:
                temp = 98
                f.write(f"T:{t} {delim1} SPD:12 {delim2} MOTOR_TEMP:{temp} | V:18.2 {noise} LIDAR:WARN\n")
            elif t == 1405:
                temp = 99
                f.write(f"T:{t} {delim1} SPD:00 {delim2} MOTOR_TEMP:{temp} | V:00.0 {noise} SYS:ERR_VOLTAGE_DROP\n")
                f.write(f"T:{t+1} {delim1} SYS:CRIT_SHUTDOWN {noise}\n")
                f.write("\n[PATHKEEPER-AI]: CRITICAL — Emergency shutdown initiated.\n")
                f.write("[MC-CHEN]: We've lost drive power. Rover is stopped.\n")
                f.write("[HARRIS]: ...What just happened?\n")
                f.write("\n[END OF TRANSMISSION]\n")
                break
            else:
                temp = max(40, min(60, temp + random.randint(-2, 2)))
                f.write(f"T:{t} {delim1} SPD:12 {delim2} MOTOR_TEMP:{temp} | V:24.1 {noise} LIDAR:NOMINAL\n")


def generate_medium_log():
    """Level 2: Turbopump Cavitation — Narrative + Noisy Sensor Data
    
    Spoilers REMOVED: No "YOUR TASK" block, no post-incident analysis,
    no explicit mention of filtering method or threshold in the notes.
    The threshold is buried in a technical spec header.
    """
    print("Generating Level 2: Medium (Narrative)...")
    with open("public/levels/level_2_medium_v2.txt", "w") as f:
        f.write("╔══════════════════════════════════════════════════════════════════════╗\n")
        f.write("║  PROPULSION TEST FACILITY — ENGINE TEST STAND 4A                    ║\n")
        f.write("║  TEST ID: RD-7X TURBOPUMP QUALIFICATION RUN #17                     ║\n")
        f.write("║  DATE: 2087-03-14 | LEAD ENGINEER: DR. ELENA VASQUEZ               ║\n")
        f.write("║  STATUS: ■■ CATASTROPHIC FAILURE — ROOT CAUSE ANALYSIS REQUIRED ■■  ║\n")
        f.write("╚══════════════════════════════════════════════════════════════════════╝\n")
        f.write("\n")
        f.write("[PRE-TEST NOTES — DR. VASQUEZ]\n")
        f.write("Sensor S1 (Inlet Pressure) has been unreliable since the transducer swap.\n")
        f.write("Individual readings are dominated by high-frequency interference.\n")
        f.write("We decided to proceed with the test regardless.\n")
        f.write("\n")
        f.write("[WARN] SENSOR S1 (INLET_P) EXPERIENCING HIGH FREQUENCY INTERFERENCE\n")
        f.write("\n")
        f.write("--- BEGIN SENSOR DATA ---\n")
        f.write("--- Specs: RD-7X Turbopump | INLET_P_CAVITATION_LIMIT: 300 PSI | MAX_RPM: 97000 ---\n")
        f.write("--- Sampling Rate: 100 Hz | Format: [T+<seconds>] INLET_P: <PSI> | PUMP_RPM: <rpm> | BRG_TEMP: <°C> ---\n")
        f.write("\n")
        
        true_pressure = 600.0
        narrative_points = {
            200: ("[T+2.000 — DR. VASQUEZ]: Pump is up to speed. RPM looks stable.\n"
                  "[TECH MORRISON]: Inlet readings are all over the place.\n"
                  "[VASQUEZ]: Noted. Proceeding.\n"),
            500: ("[T+5.000 — VASQUEZ]: Five seconds in. Bearing temp?\n"
                  "[MORRISON]: Rock solid. 120 degrees, plus or minus one.\n"
                  "[VASQUEZ]: Good. That's the one sensor I trust right now.\n"),
            800: ("[T+8.000 — VASQUEZ]: Approaching mid-test.\n"
                  "[MORRISON]: Still can't get a clean read on inlet pressure.\n"
                  "[VASQUEZ]: The raw data won't tell you anything useful by itself.\n"),
            1000: ("[T+10.000 — VASQUEZ]: Okay, ten-second mark.\n"
                   "[MORRISON]: Wait— did you hear that? A whine?\n"
                   "[VASQUEZ]: Could be nothing. Could be something.\n"
                   "[MORRISON]: I can't tell from these numbers.\n"),
            1200: ("[T+12.000 — VASQUEZ]: The whine is getting louder.\n"
                   "[MORRISON]: Should we abort?\n"
                   "[VASQUEZ]: Not yet. We need data.\n"
                   "[MORRISON]: Elena, vibration levels are climbing.\n"
                   "[VASQUEZ]: ...Noted. Two more seconds.\n"),
            1400: ("[T+14.000 — MORRISON]: ELENA!\n"
                   "[VASQUEZ]: ABORT ABORT ABORT—\n"),
        }
        
        for i in range(1, 1501):
            t = i * 0.010
            
            # Inject narrative at key points
            if i in narrative_points:
                f.write(f"\n{narrative_points[i]}\n")
            
            if i <= 1000:
                true_pressure -= 0.10
            else:
                true_pressure -= 1.00
                
            noise = random.uniform(-350, 350)
            measured_p = true_pressure + noise
            
            rpm = 95000 + random.randint(-50, 50)
            temp = 120.0 + random.uniform(-1, 1)
            
            f.write(f"[T+{t:.3f}] INLET_P: {measured_p:.2f} | PUMP_RPM: {rpm} | BRG_TEMP: {temp:.1f}\n")
            
        f.write(f"\n[T+{15.010:.3f}] SYS_ERR: CAVITATION_DETECTED\n")
        f.write(f"[T+{15.020:.3f}] SYS_ERR: PUMP_OVERSPEED_DESTRUCTION\n")
        f.write("\n[END OF RECORDING]\n")


def generate_hard_log():
    """Level 3: UAV Swarm Clock Drift — Narrative + Dense Packet Data
    
    Spoilers REMOVED: No "YOUR TASK" block, no post-incident root cause,
    no Kowalski dialogue explaining the drift mechanics.
    Mid-level commentary is panicked, not analytical.
    """
    print("Generating Level 3: Hard (Narrative)...")
    with open("public/levels/level_3_hard_v2.txt", "w") as f:
        f.write("╔═══════════════════════════════════════════════════════════════════════╗\n")
        f.write("║  NEXUS DEFENSE SYSTEMS — SWARM OPERATIONS CENTER                     ║\n")
        f.write("║  OPERATION: OVERWATCH | FLIGHT: ALPHA + BRAVO (2-SHIP FORMATION)     ║\n")
        f.write("║  OPERATOR: SGT. JAMES KOWALSKI                                       ║\n")
        f.write("║  STATUS: ■■ KINETIC IMPACT — INVESTIGATION REQUIRED ■■               ║\n")
        f.write("╚═══════════════════════════════════════════════════════════════════════╝\n")
        f.write("\n")
        f.write("[PRE-FLIGHT BRIEFING — SGT. KOWALSKI]\n")
        f.write("Standard two-ship patrol. ALPHA runs a figure-8 survey pattern while\n")
        f.write("BRAVO holds a loiter overhead as relay. Both drones report telemetry\n")
        f.write("to this console every 100ms.\n")
        f.write("\n")
        f.write("=== SWARM NETWORK INTERFACE START ===\n")
        f.write("LISTENING ON UDP PORT 14550...\n")
        f.write("[SYS] CLOCK SYNC PROTOCOL: ACTIVE | TOLERANCE: 5.0s | MODE: REJECT_STALE\n")
        f.write("\n")
        
        sys_clk = 50000.000
        drone_clk = 50000.000
        
        # Narrative is now vague/panicked — no analytical explanations
        narrative_points = {
            500: ("[KOWALSKI — T+50s]: Both ships nominal. Routine.\n"),
            1000: ("[KOWALSKI — T+100s]: Hundred seconds in. Nothing unusual.\n"),
            2000: ("[KOWALSKI — T+200s]: Still nominal. BRAVO holding position.\n"),
            3000: ("[KOWALSKI — T+300s]: Three hundred seconds. Something feels off\n"
                   "about ALPHA's data but I can't put my finger on it.\n"),
            4000: ("[KOWALSKI — T+400s]: I keep staring at these packets.\n"
                   "Something is wrong but the numbers all look valid.\n"
                   "Maybe I'm imagining it.\n"),
            4500: ("[KOWALSKI — T+450s]: Tried to radio ALPHA for a status check.\n"
                   "Response was nominal. All green on their end.\n"
                   "So why do I have a bad feeling?\n"),
            4800: ("[KOWALSKI — T+480s]: Come on. What am I missing?\n"
                   "BRAVO is fine. ALPHA is fine. Everything looks fine.\n"),
            4950: ("[KOWALSKI — T+495s]: Oh no.\n"),
        }
        
        for i in range(1, 5001):
            sys_clk += 0.100
            drone_clk += 0.099  # The silent drift (0.001s per tick)
            
            pos_x = 30.0 + (i * 0.01)
            pos_y = 10.0 + math.sin(i * 0.05)
            
            payload = {
                "uav": "ALPHA",
                "t_local": round(drone_clk, 3),
                "pos": [round(pos_x, 2), round(pos_y, 2), 15.5],
                "vel": [0.1, 0.0, 0.0],
                "prox": 0 if i < 4998 else 1,
                "bat": round(24.0 - (i * 0.001), 2)
            }
            
            chk = f"0x{(int(sys_clk) + i) % 255:02X}"
            
            # Inject narrative at key points
            if i in narrative_points:
                f.write(f"\n{narrative_points[i]}\n")
            
            if i == 4998:
                f.write(f"[SEQ:{i:05d}] RECV | SYS_TS:{sys_clk:.3f} | CHK:{chk} | PLD:{json.dumps(payload)}\n")
                f.write(f"[SEQ:{i:05d}] WARN | SYS_TS:{sys_clk:.3f} | COLLISION_AVOIDANCE_TRIGGERED\n")
            elif i == 4999:
                f.write(f"[SEQ:{i:05d}] RECV | SYS_TS:{sys_clk:.3f} | CHK:{chk} | PLD:{json.dumps(payload)}\n")
                f.write(f"[SEQ:{i:05d}] ERR  | SYS_TS:{sys_clk:.3f} | PACKET_REJECTED: STALE_TELEMETRY (DELTA > 5.0s)\n")
            else:
                f.write(f"[SEQ:{i:05d}] RECV | SYS_TS:{sys_clk:.3f} | CHK:{chk} | PLD:{json.dumps(payload)}\n")
            
            if i % 5 == 0:
                dummy_payload = {
                    "uav": "BRAVO", 
                    "t_local": round(sys_clk, 3),
                    "pos": [12.0, 44.1, 20.0],
                    "status": "LOITER"
                }
                dummy_chk = f"0x{(int(sys_clk) + i + 10) % 255:02X}"
                f.write(f"[SEQ:{i:05d}_B] RECV | SYS_TS:{sys_clk:.3f} | CHK:{dummy_chk} | PLD:{json.dumps(dummy_payload)}\n")

        f.write("\n=== FATAL KINETIC IMPACT: CONNECTION SEVERED ===\n")
        f.write("\n[END OF RECORDING]\n")


if __name__ == "__main__":
    generate_easy_log()
    generate_medium_log()
    generate_hard_log()
    print("Done! All narrative log files generated.")