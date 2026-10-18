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
| DJ Source | None | RCA out L, RCA out R | V11.5: separate left and right ports |
| iPad | None | USB-C | A compatible USB-C DAC/adapter is needed for analog audio |
| USB-C Audio Adapter | USB-C | 3.5mm analog output | Stereo 3.5mm TRS to *two* 1/4-inch TS is typical for dual mono mixer line inputs; TRS at each mixer jack can still make contact depending on cabling, hardware |
| Audio Interface | 2 combo XLR / TRS / TS | Line Out L, USB, Line Out R | XLR microphone; TRS balanced mono line; TS high-Z instrument on suitably configured inputs; L/R TRS is a pair of balanced outputs, not stereo on one cable |
| Audio Mixer | 2 XLR mic, Line A (left) and Line B (right) for TRS/TS/1/8" breakout, plus separate RCA in L and RCA in R | Main Out L, Main Out R | Physical mixer may not accept RCA or hybrid through one socket. Verify exact mixer; line input is not mic preamp input |
| RØDECaster Pro II | 4 combo XLR / TRS / TS | USB-C 1, USB-C 2, Main Out L and Main Out R (two separate balanced 1/4-inch jacks) | V11.4: matches the real two USB-C ports and two main line outputs. The four headphone outputs are not modeled. USB audio is two-way in real life; the model is simplified. |
| Laptop | USB | None | In reality laptop also sends USB audio *to* compatible audio devices (host role); lab shows only USB destination |
| PA Speakers | Left speaker input, Right speaker input (XLR/TRS/TS combo; no RCA) | None | Many powered speakers have XLR/TRS combo inputs; unpowered speakers require amplifier; stereo has distinct L/R |
| Studio Monitors | Left and Right speaker inputs (XLR/TRS/TS combo), plus separate RCA in L and RCA in R | None | Model as powered monitor(s) with separate L/R line inputs |

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
