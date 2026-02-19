# OpenClaw Qlib US Pipeline Tutorial

End-to-end tutorial for building, backtesting, and analyzing a
quantitative equity alpha model using **Microsoft Qlib** and
**OpenClaw**.

This repository demonstrates:

-   Cloning and configuring Qlib
-   Downloading the US stock dataset
-   Training a LightGBM alpha model
-   Running a portfolio backtest
-   Generating performance reports and plots
-   Fixing common environment and calendar issues

------------------------------------------------------------------------

# Overview

This pipeline performs:

1.  Data download (Qlib US dataset)
2.  Feature engineering (Alpha158)
3.  Model training (LightGBM)
4.  Signal generation
5.  Portfolio backtesting
6.  Report and plot generation

------------------------------------------------------------------------

# Repository Structure

    .
    ├── workflow_config_lgb_us.yaml   # Qlib workflow config
    ├── make_plots.py                 # Plot generation script
    ├── plots/                        # Output plots
    ├── REPORT.md                     # Backtest report
    └── README.md                     # This file

------------------------------------------------------------------------

# Requirements

## Python

Python 3.7+ recommended

## Install dependencies

``` bash
pip install pyqlib torch cvxpy
```

## Windows Only

cvxpy requires:

-   Visual Studio Build Tools
-   MSVC v143 toolchain
-   Windows SDK

Reboot after installation.

------------------------------------------------------------------------

# Step 1 --- Clone Qlib

``` bash
git clone https://github.com/microsoft/qlib.git
cd qlib
pip install -e .
```

Create working directory:

``` bash
mkdir qlib_us_transformer
cd qlib_us_transformer
```

------------------------------------------------------------------------

# Step 2 --- Download US Dataset

``` bash
python -c "from qlib.tests.data import GetData; from qlib.constant import REG_US; GetData().qlib_data(target_dir='~/.qlib/qlib_data/us_data', region=REG_US, exists_skip=True)"
```

------------------------------------------------------------------------

# Step 3 --- Configure Workflow

Example config:

``` yaml
region: US
universe: sp500
features: Alpha158
label: next-day return
model: LGBModel

strategy:
  name: TopkDropoutStrategy
  topk: 50
  n_drop: 5
```

------------------------------------------------------------------------

# Step 4 --- Run Workflow

``` bash
qrun workflow_config_lgb_us.yaml
```

------------------------------------------------------------------------

# Step 5 --- Fix Calendar Errors

If you see:

    IndexError: index X is out of bounds

Find last calendar date:

``` python
import qlib
from qlib.data import D
from qlib.config import REG_US

qlib.init(provider_uri='~/.qlib/qlib_data/us_data', region=REG_US)
cal = D.calendar(freq='day')

print(cal[-2], cal[-1])
```

Set workflow config:

``` yaml
end_time: LAST_VALID_DATE_MINUS_ONE
```

------------------------------------------------------------------------

# Step 6 --- Results

Example performance:

  Metric          Value
  --------------- ---------
  IC              0.0106
  Rank IC         0.0086
  Annual Return   -0.0418
  IR              -0.338
  Max Drawdown    -0.2705

Interpretation: Weak alpha signal.

------------------------------------------------------------------------

# Step 7 --- Generate Plots

``` bash
python make_plots.py
```

Generated plots:

-   Equity curve
-   Drawdown
-   IC series
-   Rank IC
-   Turnover

------------------------------------------------------------------------

# Step 8 --- Outputs

    plots/
    REPORT.md

------------------------------------------------------------------------

# OpenClaw Integration

OpenClaw handled:

-   Running commands
-   Installing dependencies
-   Fixing environment issues
-   Writing configs
-   Generating reports and plots

------------------------------------------------------------------------

# Next Steps

Improve performance using:

-   Transformer models
-   XGBoost
-   MLP models
-   Hyperparameter tuning
-   Long-short portfolios
-   Updated datasets

------------------------------------------------------------------------

# References

-   https://github.com/microsoft/qlib

------------------------------------------------------------------------

# License

MIT License
