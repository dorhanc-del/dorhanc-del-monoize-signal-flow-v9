# Monoize Signal Flow — Input & Output Audit (V11.5)

This is the modeled classroom equipment catalog, **not** a guarantee of every hardware model's physical jacks. The current app validates connector choice at ports, not voltage levels, gain stages, USB host roles, channel count, or phantom power.

| Card | Inputs in lab | Outputs in lab | Notes / accuracy cautions |
|---|---|---|---|
| Voice | None | Acoustic sound | Not a wire; acoustic link to microphone |
| Handheld Mic | Acoustic sound | XLR | Assumes wired dynamic microphone |
| Condenser Mic | Acoustic sound | XLR | Usually requires phantom power (not simulated) |
| Wireless Mic | Acoustic sound | Wireless signal | Transmitter and receiver must be paired; technology specific |
| Wireless Receiver | Wireless signal | XLR | Only valid if the **actual receiver** has XLR output (e.g. appropriate pro receiver). A DJI-style receiver often uses 3.5mm output, so don't infer XLR from a photo |
| Electric Guitar | None | 1/4-inch TS | Instrument-level, usually high impedance |
| DJ Source (Pioneer DDJ-FLX4, V11.6) | Mic input (1/4" unbalanced) | Master Out L/R (RCA) | USB-C (computer/power) not modeled. |
| iPad | None | USB-C | A compatible USB-C DAC/adapter is needed for analog audio |
| USB-C Audio Adapter | USB-C | 3.5mm analog output | Stereo 3.5mm TRS to *two* 1/4-inch TS is typical for dual mono mixer line inputs; TRS at each mixer jack can still make contact depending on cabling, hardware |
| Audio Interface | 2 combo XLR / TRS / TS | Line Out L, USB, Line Out R | XLR microphone; TRS balanced mono line; TS high-Z instrument on suitably configured inputs; L/R TRS is a pair of balanced outputs, not stereo on one cable |
| Audio Mixer (Yamaha MG10XU, V11.6) | Ch 1–4 Mic/Line combo (XLR/TRS/TS), Ch 5/6 and 7/8 line L/R (1/4" TRS/TS or 1/8" breakout), RCA 5 L / RCA 6 R | Stereo Out L/R (1/4" TRS/TS), Stereo Out L/R (XLR), Monitor Out L/R (1/4") | Ch 9/10, RCA 7/8, FX Send, phones, USB not modeled. Old ports keep positions 0–5 (in) and 0–1 (out). |
| RØDECaster Pro II | 4 combo XLR / TRS / TS | USB-C 1, USB-C 2, Main Out L and Main Out R (two separate balanced 1/4-inch jacks) | V11.4: matches the real two USB-C ports and two main line outputs. The four headphone outputs are not modeled. USB audio is two-way in real life; the model is simplified. |
| Laptop | USB | None | In reality laptop also sends USB audio *to* compatible audio devices (host role); lab shows only USB destination |
| PA Speakers (LD Systems MAUI 28 G3 MIX column PA, V11.6) | Input 1, Input 2, Input 3, Input 4 (XLR/TRS/TS combo) | Monitor 1 out, Monitor 2 out, System Out (XLR) | One powered column unit with a built-in mixer. A stereo source uses two inputs (e.g. Main Out L → Input 1, Main Out R → Input 2). Footswitch, SysLink and Bluetooth are not modeled. |
| Studio Monitors (Mackie CR3.5, V11.6) | TRS input L/R (1/4" only, no XLR), RCA in L/R | None | 1/8" Stereo In and the passive-speaker output are not modeled. |

## Recommended next-phase modeling refinements
1. (Done in V11.5) Stereo pairs are explicit left and right ports for DJ gear, interfaces, mixers and loudspeakers.
2. Distinguish signal types: mic level, instrument/Hi-Z, consumer -10 dBV line, pro +4 dBu line, digital USB, acoustic and wireless RF, separately from connector types.
3. Require headphone/3.5mm stereo breakout cable mapped to TWO line inputs, rather than pretending a single TRS line port is stereo L/R.
4. Model phantom power as an optional condenser-mic condition.
5. Give generic wireless receiver a photo that actually has XLR outputs, or model receiver 3.5mm plus appropriate converter.
6. Model USB host vs USB device and audio interface input/output directions.

## Example signal paths
- Voice (acoustic) → wired microphone (XLR) → audio interface XLR mic in → TRS line out → mixer TRS line input → mixer TRS out → powered PA line input.
- Guitar TS → interface TS high-Z input → interface USB → laptop (with compatible host/device behavior).
- Voice (acoustic) → wireless transmitter (RF) → receiver (XLR only when hardware actually supports it) → mixer XLR mic/line appropriate input → PA.
