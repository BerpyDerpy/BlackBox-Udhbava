import random
import math
import base64

def generate_easy_log():
    print("Generating Level 1: Easy...")
    with open("level_1_easy.txt", "w") as f:
        f.write("[NOISE]..INITIATING ROVER TELEMETRY..[START]\n")
        temp = 45
        for t in range(1000, 1500):
            noise = "".join(random.choices("!@#$%^&*()", k=random.randint(2, 5)))
            delim1 = random.choice(["|", ";", ","])
            delim2 = random.choice(["|", ";", ","])
            
            if t == 1404:
                temp = 98
                f.write(f"T:{t} {delim1} SPD:12 {delim2} MOTOR_TEMP:{temp} | V:18.2 {noise} LIDAR:WARN\n")
            elif t == 1405:
                temp = 99
                f.write(f"T:{t} {delim1} SPD:00 {delim2} MOTOR_TEMP:{temp} | V:00.0 {noise} SYS:ERR_VOLTAGE_DROP\n")
                f.write(f"T:{t+1} {delim1} SYS:CRIT_SHUTDOWN {noise}\n")
                break
            else:
                temp = max(40, min(60, temp + random.randint(-2, 2)))
                f.write(f"T:{t} {delim1} SPD:12 {delim2} MOTOR_TEMP:{temp} | V:24.1 {noise} LIDAR:NOMINAL\n")
        f.write("[NOISE]..CONNECTION LOST..[END]\n")

def generate_medium_log():
    print("Generating Level 2: Medium...")
    with open("level_2_medium.txt", "w") as f:
        f.write("[T+0.000] PROPULSION SYSTEM TEST - MAIN ENGINE START\n")
        # Base stable pressure and flow
        base_pressure = 500
        base_flow = 160
        
        for i in range(1, 151):
            t = i * 0.010
            # Introduce an escalating sinusoidal oscillation (Combustion Instability)
            instability_factor = (i / 150.0) ** 3 # Starts low, grows exponentially
            pressure = int(base_pressure + (math.sin(i * 0.5) * 200 * instability_factor))
            flow = int(base_flow + (math.cos(i * 0.5) * 80 * instability_factor))
            
            # Convert to hex, pad to 4 chars
            hex_p = f"0x{pressure:04X}"
            hex_f = f"0x{flow:04X}"
            
            if i == 150:
                f.write(f"[T+{t:.3f}] VALVES:OPEN | IGN:ON | SYS: STRUCTURAL_FAILURE_DETECTED\n")
            else:
                f.write(f"[T+{t:.3f}] VALVES:OPEN | IGN:ON | PYLD: {hex_p} {hex_f}\n")

import math
import json

def generate_hard_log():
    print("Generating Level 3: Hard (Packet Dump)...")
    with open("level_3_hard_v2.txt", "w") as f:
        sys_clk = 50000.000
        drone_clk = 50000.000
        
        # Initial setup noise
        f.write("=== SWARM NETWORK INTERFACE START ===\n")
        f.write("LISTENING ON UDP PORT 14550...\n")
        f.write("[SYS] CLOCK SYNC ESTABLISHED. TOLERANCE: 5.0s\n")
        
        for i in range(1, 5001):
            sys_clk += 0.100
            drone_clk += 0.099 # The silent drift (0.001s per tick)
            
            pos_x = 30.0 + (i * 0.01)
            pos_y = 10.0 + math.sin(i * 0.05)
            
            # Create a realistic-looking, dense JSON payload
            payload = {
                "uav": "ALPHA",
                "t_local": round(drone_clk, 3),
                "pos": [round(pos_x, 2), round(pos_y, 2), 15.5],
                "vel": [0.1, 0.0, 0.0],
                "prox": 0 if i < 4998 else 1,
                "bat": round(24.0 - (i * 0.001), 2)
            }
            
            # Dummy hex checksum for visual noise
            chk = f"0x{(int(sys_clk) + i) % 255:02X}"
            
            # Write the main drone packet
            if i == 4998:
                f.write(f"[SEQ:{i:05d}] RECV | SYS_TS:{sys_clk:.3f} | CHK:{chk} | PLD:{json.dumps(payload)}\n")
                f.write(f"[SEQ:{i:05d}] WARN | SYS_TS:{sys_clk:.3f} | COLLISION_AVOIDANCE_TRIGGERED\n")
            elif i == 4999:
                f.write(f"[SEQ:{i:05d}] RECV | SYS_TS:{sys_clk:.3f} | CHK:{chk} | PLD:{json.dumps(payload)}\n")
                f.write(f"[SEQ:{i:05d}] ERR  | SYS_TS:{sys_clk:.3f} | PACKET_REJECTED: STALE_TELEMETRY (DELTA > 5.0s)\n")
            else:
                f.write(f"[SEQ:{i:05d}] RECV | SYS_TS:{sys_clk:.3f} | CHK:{chk} | PLD:{json.dumps(payload)}\n")
            
            # Interleave traffic from a second drone to confuse LLMs and break simple line-by-line reading
            if i % 5 == 0:
                dummy_payload = {
                    "uav": "BRAVO", 
                    "t_local": round(sys_clk, 3), # Bravo's clock is perfectly synced
                    "pos": [12.0, 44.1, 20.0],
                    "status": "LOITER"
                }
                dummy_chk = f"0x{(int(sys_clk) + i + 10) % 255:02X}"
                f.write(f"[SEQ:{i:05d}_B] RECV | SYS_TS:{sys_clk:.3f} | CHK:{dummy_chk} | PLD:{json.dumps(dummy_payload)}\n")

        f.write("=== FATAL KINETIC IMPACT: CONNECTION SEVERED ===\n")

if __name__ == "__main__":
    generate_easy_log()
    generate_medium_log()
    generate_hard_log()
    print("Done! Files generated.")