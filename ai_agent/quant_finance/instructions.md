OpenClaw Tutorial: End‑to‑End Qlib US Pipeline (Model → Backtest → Report → Plots)
This tutorial shows how I used OpenClaw to:

clone and configure Qlib
download US dataset
train an LGBM alpha model
run a portfolio backtest
generate a report + plots
fix environment issues (PyTorch, cvxpy, MSVC tools)
resolve backtest calendar errors

---
1) Workspace & Setup
# OpenClaw workspace
C:\Users\yuxia\.openclaw\workspace


We cloned Qlib and created a working folder:

git clone https://github.com/microsoft/qlib.git
mkdir qlib_us_transformer


---

2) Qlib US Pipeline Configuration (LGBM)
We created a config:

C:\Users\yuxia\.openclaw\workspace\qlib_us_transformer\workflow_config_lgb_us.yaml


Key settings:

Region: US
Universe: S&P 500
Features: Alpha158
Label: next‑day return
Model: LGBModel
Backtest strategy: TopK Dropout (topk=50, n_drop=5)

---
3) Download US Dataset
Qlib provides a built‑in download helper:

python -c "from qlib.tests.data import GetData; from qlib.constant import REG_US; GetData().qlib_data(target_dir='~/.qlib/qlib_data/us_data', region=REG_US, exists_skip=True)"


Data stored at:

C:\Users\yuxia\.qlib\qlib_data\us_data


---

4) Install Dependencies (Key Fixes)
We installed:

pip install pyqlib torch
pip install cvxpy


On Windows, cvxpy required:

✅ Visual Studio Build Tools
✅ MSVC v143 + Windows SDK
✅ Reboot to register toolchain

---

5) Run Qlib Workflow
Run the workflow with qrun:

C:\Users\yuxia\AppData\Local\Programs\Python\Python37\Scripts\qrun.exe workflow_config_lgb_us.yaml


---

6) Fixing Backtest Calendar Errors
Backtest failed with:

IndexError: index X is out of bounds for axis 0


Reason: backtest end date exceeded Qlib calendar.
Solution:

1) Query last available date:

import qlib
from qlib.data import D
from qlib.config import REG_US

qlib.init(provider_uri='~/.qlib/qlib_data/us_data', region=REG_US)
cal = D.calendar(freq='day')
print(cal[-2], cal[-1])


2) Set end_time to last‑1 date in YAML:
end_time: 2020-11-09


---

7) Results (Key Metrics)
Signal quality:

IC ≈ 0.0106
Rank IC ≈ 0.0086

Backtest (excess return):

Annualized return (with cost) ≈ ‑0.0418
IR ≈ ‑0.338
Max drawdown ≈ ‑0.2705

Interpretation: weak alpha, negative excess returns after cost.

---

8) Generate Report
Report saved at:

C:\Users\yuxia\.openclaw\workspace\qlib_us_transformer\REPORT.md


---

9) Export Plots
We exported:

Equity curve
Drawdown
IC series
Rank IC series
Turnover

Script:

python .\make_plots.py


Output folder:
C:\Users\yuxia\.openclaw\workspace\qlib_us_transformer\plots\


---

10) OpenClaw Role in This Workflow
OpenClaw handled:

✅ Running PowerShell / Python commands
✅ Installing dependencies
✅ Handling errors + retries
✅ Writing YAML configs
✅ Creating report + plots
✅ Sending results back to Discord
---

Next Steps (Optional)
Try stronger models (Transformer, MLP, XGBoost)
Use newer calendar data
Tune LGBM hyperparameters
Run long‑short portfolio strategy