# PolyClaw + OpenClaw (WSL2) — Getting Started

Author: [Dr. Yuxiao (Rain) Luo](https://github.com/yuxiaoluo)

This guide shows how to set up and use **PolyClaw** through **OpenClaw** on Windows using **WSL2**. It includes **clarifications**, **interpretation tips**, and **common pitfalls**.

> Credits to [PolyClaw GitHub repo](https://github.com/chainstacklabs/polyclaw).

---

## ✅ What PolyClaw is (in plain terms)
PolyClaw is an OpenClaw skill that lets you **browse Polymarket markets**, check prices/liquidity, and optionally **trade** via wallet + on‑chain execution. In OpenClaw, we use it primarily for:

- **Market discovery** (trending, search)
- **Market inspection** (full JSON details)
- **Portfolio & position tracking** (if wallet configured)

> If you only want market info, you do **not** need a wallet or private key.

---

## 1) Verify WSL2 (required)
PolyClaw runs cleanly inside WSL2 (Linux). On Windows native Python, dependency setup is more brittle.

```powershell
wsl -l -v
```
You should see **Ubuntu‑22.04** with version **2**.

---

## 2) Install `uv` in WSL
`uv` is the tool PolyClaw uses to install and run dependencies.

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.local/bin/env
```

If `uv` is not found later, re‑run:
```bash
source ~/.local/bin/env
```

---

## 3) Go to PolyClaw skill

```bash
cd /mnt/c/Users/yuxia/.openclaw/skills/polyclaw
```

---

## 4) Install dependencies

```bash
UV_PYTHON=python3.11 uv sync
```

**Interpretation:**
- This creates a local `.venv` for PolyClaw.
- All required Python libraries are installed in that environment.

---

## 5) Browse markets (read‑only)
These do **not** require wallet setup.

### Trending markets
```bash
uv run python scripts/polyclaw.py markets trending
```

### Search markets
```bash
uv run python scripts/polyclaw.py markets search "china"
```

### Full market details (JSON)
```bash
uv run python scripts/polyclaw.py market <market_id>
```

---

## 6) Interpreting market output
A typical market record includes:

- **YES / NO prices** → current implied probability (YES price ≈ probability)
- **24h volume** → activity in last day (higher = more liquid / popular)
- **Liquidity** → depth available at the best prices
- **End date** → when the market resolves

**Example interpretation:**
If a market shows YES = $0.02, NO = $0.98, the market estimates **~2% chance** of YES outcome.

---

## 7) Trading setup (optional)
If you want to trade, you need on‑chain setup.

### Required env vars
```bash
export POLYCLAW_PRIVATE_KEY="0x..."
export CHAINSTACK_NODE="https://polygon-rpc-url"
```

### One‑time approvals
```bash
uv run python scripts/polyclaw.py wallet approve
```
This submits contract approvals on Polygon. (Small gas cost.)

---

## 8) Example trading commands

```bash
# Buy YES for $50
uv run python scripts/polyclaw.py buy <market_id> YES 50

# Buy NO for $25
uv run python scripts/polyclaw.py buy <market_id> NO 25
```

**Interpretation:**
PolyClaw does a **split + sell** flow:
1. Splits USDC.e into YES/NO tokens
2. Sells the unwanted side
3. You keep the side you want

---

## 9) Common issues & fixes

### ✅ `uv` not found
```bash
source ~/.local/bin/env
```

### ✅ “CLOB order failed”
Usually Cloudflare blocks your IP. Use a proxy:
```bash
export HTTPS_PROXY="http://user:pass@proxy:port"
export CLOB_MAX_RETRIES=10
```

### ✅ “No wallet available”
Set `POLYCLAW_PRIVATE_KEY` in your shell.

### ✅ Only want browsing
You can ignore wallet setup entirely.

---

## 10) Example OpenClaw prompts

- “Use PolyClaw to show trending markets.”
- “Search Polymarket for ‘NFL’.”
- “Get full details for market 654415.”

---

## ✅ Quick Summary
- **Use WSL2** for best stability
- **`uv sync`** once, then use `uv run` for commands
- **Wallet only needed if trading**
- YES/NO prices ≈ implied probability

---
