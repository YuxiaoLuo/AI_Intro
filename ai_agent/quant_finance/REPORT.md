# Qlib US LGBM Portfolio – Analysis Report

## 1) Executive Summary
We implemented a Qlib US equities pipeline using an LGBM model on Alpha158 features and backtested a TopK‑Dropout portfolio. The model achieved weak but positive IC/Rank‑IC; however, **portfolio excess returns were negative after transaction costs**, indicating the signal does not translate into profitable trading under the current configuration.

**Key takeaways**
- Signal quality is modest (IC ~0.0106, Rank‑IC ~0.0086).
- Backtest shows **negative excess return**, worsened by transaction costs.
- The alpha is likely too weak for live trading without further feature/model improvements and cost modeling.

---

## 2) Setup & Data
- **Framework**: Qlib (US dataset)
- **Universe**: S&P 500 (sp500)
- **Features**: Alpha158
- **Label**: next‑day return, `Ref($close, -2)/Ref($close, -1) - 1`
- **Train/Valid/Test**:
  - Train: 2008‑01‑01 → 2016‑12‑31
  - Valid: 2017‑01‑01 → 2018‑12‑31
  - Test: 2019‑01‑01 → 2020‑11‑09 (limited by dataset calendar)
- **Preprocess**:
  - RobustZScoreNorm (feature group)
  - Fillna (feature group)
  - DropnaLabel, CSRankNorm (label group)

---

## 3) Model Configuration
- **Model**: `LGBModel` (qlib.contrib.model.gbdt)
- **Loss**: MSE
- **Threads**: 8
- **Dataset**: `DatasetH` with Alpha158 handler

---

## 4) Signal Quality (SigAnaRecord)
From the signal analysis:
- **IC**: **0.010553**
- **ICIR**: **0.0997**
- **Rank IC**: **0.008565**
- **Rank ICIR**: **0.06845**

**Interpretation**: The predictive signal exists but is weak. IC/Rank‑IC are positive yet small, implying limited rank ordering power on next‑day returns.

---

## 5) Portfolio Backtest (PortAnaRecord)
**Strategy**: TopK‑Dropout (TopK=50, n_drop=5)

### Benchmark (1‑day)
- **Annualized return**: **0.1335**
- **Information ratio**: **0.6619**
- **Max drawdown**: **‑0.3825**
- **Mean daily return**: **0.000561**
- **Volatility (std)**: **0.01308**

### Excess Return (No Cost)
- **Annualized return**: **‑0.0236**
- **Information ratio**: **‑0.1906**
- **Max drawdown**: **‑0.2705**
- **Mean daily return**: **‑0.000099**
- **Volatility (std)**: **0.00802**

### Excess Return (With Cost)
- **Annualized return**: **‑0.0418**
- **Information ratio**: **‑0.3380**
- **Max drawdown**: **‑0.2705**
- **Mean daily return**: **‑0.000176**
- **Volatility (std)**: **0.00802**

**Interpretation**: The portfolio does not outperform the benchmark. Transaction costs further reduce performance. The strategy is not profitable in this configuration.

---

## 6) Risk & Robustness Notes
- Some NaNs exist in `$close` during backtest (warnings seen). This can affect trade execution quality and should be cleaned or filtered.
- The dataset calendar ends at 2020‑11‑10. Backtest end date was set to 2020‑11‑09 to avoid calendar boundary errors.
- Qlib warns about future calendar data not being available; consider updating the calendar via Qlib data collector.

---

## 7) Recommendations / Next Steps
1) **Improve alpha strength**
   - Experiment with richer feature sets (Alpha360, custom signals) or alternative target definitions.
   - Tune LightGBM hyperparameters (num_leaves, learning_rate, feature_fraction, bagging_fraction, early stopping).

2) **Model alternatives**
   - Try nonlinear models (MLP/Transformer) once stability is ensured.
   - Try tree‑based ensembles or multi‑task formulations.

3) **Portfolio construction**
   - Test alternative portfolio rules (e.g., long‑short, risk parity, constraints)
   - Evaluate turnover and cost‑aware rebalancing.

4) **Data quality**
   - Refresh Qlib US dataset to ensure up‑to‑date calendar and reduce NaNs.

---

## 8) Artifacts
Generated artifacts (in Qlib recorder directory):
- `pred.pkl` (predictions)
- `port_analysis_1day.pkl`
- `indicator_analysis_1day.pkl`

If you want, I can export these artifacts and attach them, or generate plots (equity curve, drawdown, IC distribution).
