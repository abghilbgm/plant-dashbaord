import React from "react";

export default function UnitHeadDashboardView({ data, loading, fmt }) {
  if (loading && !data) {
    return (
      <div className="uh-loading-container">
        <div className="uh-spinner"></div>
        <p>Loading Executive Metrics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="uh-error-container">
        <p>Failed to load Unit Head Dashboard data. Please refresh.</p>
      </div>
    );
  }

  const { safety, production, fgStock, processParams, rawMaterials, powerEngg } = data;

  return (
    <div className="uh-grid-container">
      {/* 1. SAFETY & COMPLIANCE HEADER CARD */}
      <div className="uh-card safety-card span-all">
        <div className="uh-card-header">

          <h3>Safety & Compliance KPI Summary</h3>
        </div>
        <div className="safety-metrics-grid">
          {/* First Aid */}
          <div className="safety-tile">
            <div className="safety-label">First Aid (FA)</div>
            <div className="safety-badge green">0 Today</div>
            <div className="safety-sub">MTD: {safety.fa_mtd} | YTD: {safety.fa_ytd}</div>
          </div>
          {/* Lost Time Injury */}
          <div className="safety-tile">
            <div className="safety-label">Lost Time Injury (LTI)</div>
            <div className="safety-badge green">0 Today</div>
            <div className="safety-sub">MTD: {safety.lti_mtd} | YTD: {safety.lti_ytd}</div>
          </div>
          {/* BBSO */}
          <div className="safety-tile">
            <div className="safety-label">BBSO Adherence</div>
            <div className="safety-value">{safety.bbso_today}%</div>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${safety.bbso_today}%` }}></div>
            </div>
            <div className="safety-sub">Target: 95.0% | MTD: {safety.bbso_mtd}%</div>
          </div>
          {/* Walkdowns */}
          <div className="safety-tile">
            <div className="safety-label">Mgt Walkdown (Count / % Close)</div>
            <div className="safety-value">{safety.walk_count_today} / {safety.walk_close_pct}%</div>
            <div className="safety-sub">MTD Count: {safety.walk_count_mtd}</div>
          </div>
          {/* NDO Adherence */}
          <div className="safety-tile">
            <div className="safety-label">NDO Plan Adh. / Comp. Obs.</div>
            <div className="safety-value">{safety.ndo_adh_pct}% / {safety.ndo_comp_pct}%</div>
          </div>
          {/* E-Permit */}
          <div className="safety-tile">
            <div className="safety-label">e-Permit Verification</div>
            <div className="safety-value">{safety.e_permit_pct}%</div>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${safety.e_permit_pct}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PRODUCTION & DESPATCH GRID */}
      <div className="uh-card production-card">
        <div className="uh-card-header">

          <h3>Production & Despatch</h3>
        </div>
        <div className="uh-table-wrap">
          <table className="uh-custom-table">
            <thead>
              <tr>
                <th>Product</th>
                <th className="txt-right">Daily (A/P)</th>
                <th className="txt-right">MTD (A/P)</th>
                <th className="txt-right">YTD (A/P)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold">Hydrate (Hyd)</td>
                <td className="txt-right font-mono">{fmt(production.hydrate.d_act)} / {fmt(production.hydrate.d_plan)}</td>
                <td className="txt-right font-mono">{fmt(production.hydrate.mtd_act)} / {fmt(production.hydrate.mtd_plan)}</td>
                <td className="txt-right font-mono">{fmt(production.hydrate.ytd_act)} / {fmt(production.hydrate.ytd_plan)}</td>
              </tr>
              <tr>
                <td className="font-bold">Calcined (Cal)</td>
                <td className="txt-right font-mono">{fmt(production.calcined.d_act)} / {fmt(production.calcined.d_plan)}</td>
                <td className="txt-right font-mono">{fmt(production.calcined.mtd_act)} / {fmt(production.calcined.mtd_plan)}</td>
                <td className="txt-right font-mono">{fmt(production.calcined.ytd_act)} / {fmt(production.calcined.ytd_plan)}</td>
              </tr>
              <tr className="special-row">
                <td className="font-bold">* Spl Hydrate</td>
                <td className="txt-right font-mono">{fmt(production.special_hydrate.d_act)} / {fmt(production.special_hydrate.d_plan)}</td>
                <td className="txt-right font-mono">{fmt(production.special_hydrate.mtd_act)} / {fmt(production.special_hydrate.mtd_plan)}</td>
                <td className="txt-right font-mono">{fmt(production.special_hydrate.ytd_act)} / {fmt(production.special_hydrate.ytd_plan)}</td>
              </tr>
              <tr className="sub-row">
                <td className="pl-4 text-muted">└ Hy</td>
                <td className="txt-right font-mono">{fmt(production.special_hydrate.d_act * 0.65)}</td>
                <td className="txt-right font-mono">{fmt(production.special_hydrate.mtd_act * 0.65)}</td>
                <td className="txt-right font-mono">{fmt(production.special_hydrate.ytd_act * 0.65)}</td>
              </tr>
              <tr className="sub-row">
                <td className="pl-4 text-muted">└ Al.</td>
                <td className="txt-right font-mono">{fmt(production.special_hydrate.d_act * 0.35)}</td>
                <td className="txt-right font-mono">{fmt(production.special_hydrate.mtd_act * 0.35)}</td>
                <td className="txt-right font-mono">{fmt(production.special_hydrate.ytd_act * 0.35)}</td>
              </tr>
              <tr className="border-top">
                <td className="font-bold">Dispatch (Disp)</td>
                <td className="txt-right font-mono">{fmt(production.dispatch.d_act)} / {fmt(production.dispatch.d_plan)}</td>
                <td className="txt-right font-mono">{fmt(production.dispatch.mtd_act)} / {fmt(production.dispatch.mtd_plan)}</td>
                <td className="txt-right font-mono">{fmt(production.dispatch.ytd_act)} / {fmt(production.dispatch.ytd_plan)}</td>
              </tr>
              <tr>
                <td className="font-bold">Bagging</td>
                <td className="txt-right font-mono">{fmt(production.bagging.d_act)} / {fmt(production.bagging.d_plan)}</td>
                <td className="txt-right font-mono">{fmt(production.bagging.mtd_act)} / {fmt(production.bagging.mtd_plan)}</td>
                <td className="txt-right font-mono">{fmt(production.bagging.ytd_act)} / {fmt(production.bagging.ytd_plan)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. FINISHED GOODS STOCK (FG STOCK) */}
      <div className="uh-card stock-card">
        <div className="uh-card-header">

          <h3>Finished Goods (FG) Stock</h3>
        </div>
        <div className="uh-table-wrap">
          <table className="uh-custom-table">
            <thead>
              <tr>
                <th>Stock Location / Type</th>
                <th className="txt-right">Today (MT)</th>
                <th className="txt-right">MTD (MT)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold">Building Stock (Bldg.)</td>
                <td className="txt-right font-mono text-cyan">{fmt(fgStock.bldg_stock_today)}</td>
                <td className="txt-right font-mono">{fmt(fgStock.bldg_stock_mtd)}</td>
              </tr>
              <tr>
                <td className="font-bold">Finished Goods (FG)</td>
                <td className="txt-right font-mono text-cyan">{fmt(fgStock.fg_today)}</td>
                <td className="txt-right font-mono">{fmt(fgStock.fg_mtd)}</td>
              </tr>
              <tr>
                <td className="font-bold">Trial Stock</td>
                <td className="txt-right font-mono text-cyan">{fmt(fgStock.trial_today)}</td>
                <td className="txt-right font-mono">{fmt(fgStock.trial_mtd)}</td>
              </tr>
              <tr>
                <td className="font-bold">Rejection (Rej)</td>
                <td className="txt-right font-mono text-danger">{fmt(fgStock.rej_today)}</td>
                <td className="txt-right font-mono">{fmt(fgStock.rej_mtd)}</td>
              </tr>
              <tr>
                <td className="font-bold">UCSP</td>
                <td className="txt-right font-mono text-cyan">{fmt(fgStock.ucsp_today)}</td>
                <td className="txt-right font-mono">{fmt(fgStock.ucsp_mtd)}</td>
              </tr>
            </tbody>
          </table>
          <div className="stock-footer-kpis">
            <div className="stock-kpi">
              <span className="label">ASRS Utilisation</span>
              <span className="val font-mono">{fgStock.asrs_use_pct}%</span>
            </div>
            <div className="stock-kpi border-left">
              <span className="label">RFID Verification</span>
              <span className="val font-mono">{fgStock.rfid_ver_pct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PROCESS PARAMETERS */}
      <div className="uh-card params-card">
        <div className="uh-card-header">

          <h3>Process Parameters</h3>
        </div>
        <div className="uh-table-wrap">
          <table className="uh-custom-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th className="txt-right">Today</th>
                <th className="txt-right">Yesterday</th>
                <th className="txt-right">MTD Avg</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold">Productivity (P'tivity)</td>
                <td className="txt-right font-mono text-green">{fmt(processParams.productivity.today)}</td>
                <td className="txt-right font-mono">{fmt(processParams.productivity.yesterday)}</td>
                <td className="txt-right font-mono text-cyan">{fmt(processParams.productivity.mtd)}</td>
              </tr>
              <tr>
                <td className="font-bold">Mother Liquor (ML) Flow <span className="unit">m³/h</span></td>
                <td className="txt-right font-mono text-green">{fmt(processParams.ml_flow.today)}</td>
                <td className="txt-right font-mono">{fmt(processParams.ml_flow.yesterday)}</td>
                <td className="txt-right font-mono text-cyan">{fmt(processParams.ml_flow.mtd)}</td>
              </tr>
              <tr>
                <td className="font-bold">Organic Removal (OR) <span className="unit">%</span></td>
                <td className="txt-right font-mono text-green">{fmt(processParams.or_removal.today)}%</td>
                <td className="txt-right font-mono">{fmt(processParams.or_removal.yesterday)}%</td>
                <td className="txt-right font-mono text-cyan">{fmt(processParams.or_removal.mtd)}%</td>
              </tr>
              <tr>
                <td className="font-bold">Chemical Extraction (Che. Ext.) <span className="unit">m³/h</span></td>
                <td className="txt-right font-mono text-green">{fmt(processParams.che_ext.today)}</td>
                <td className="txt-right font-mono">{fmt(processParams.che_ext.yesterday)}</td>
                <td className="txt-right font-mono text-cyan">{fmt(processParams.che_ext.mtd)}</td>
              </tr>
              <tr>
                <td className="font-bold">Lime Wash Soda (LWS) <span className="unit">t/h</span></td>
                <td className="txt-right font-mono text-green">{fmt(processParams.lws.today)}</td>
                <td className="txt-right font-mono">{fmt(processParams.lws.yesterday)}</td>
                <td className="txt-right font-mono text-cyan">{fmt(processParams.lws.mtd)}</td>
              </tr>
              <tr>
                <td className="font-bold">Fresh Water (Fresh W) <span className="unit">m³/h</span></td>
                <td className="txt-right font-mono text-green">{fmt(processParams.fresh_water.today)}</td>
                <td className="txt-right font-mono">{fmt(processParams.fresh_water.yesterday)}</td>
                <td className="txt-right font-mono text-cyan">{fmt(processParams.fresh_water.mtd)}</td>
              </tr>
              <tr>
                <td className="font-bold">Heavy Fuel Oil (HFO) <span className="unit">t/d</span></td>
                <td className="txt-right font-mono text-green">{fmt(processParams.hfo.today)}</td>
                <td className="txt-right font-mono">{fmt(processParams.hfo.yesterday)}</td>
                <td className="txt-right font-mono text-cyan">{fmt(processParams.hfo.mtd)}</td>
              </tr>
              <tr>
                <td className="font-bold">PSD (D50) <span className="unit">µm</span></td>
                <td className="txt-right font-mono text-green">{fmt(processParams.psd.today)}</td>
                <td className="txt-right font-mono">{fmt(processParams.psd.yesterday)}</td>
                <td className="txt-right font-mono text-cyan">{fmt(processParams.psd.mtd)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. RAW MATERIALS (RM) & QUALITY */}
      <div className="uh-card rm-card">
        <div className="uh-card-header">

          <h3>Raw Materials & Quality</h3>
        </div>
        <div className="uh-table-wrap">
          <table className="uh-custom-table">
            <thead>
              <tr>
                <th>Material</th>
                <th className="txt-right">Receipt (T)</th>
                <th className="txt-right">Stock (T)</th>
                <th className="txt-right">Consumption (T)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="special-row">
                <td className="font-bold">Bauxite (Bxt)</td>
                <td className="txt-right font-mono font-bold text-cyan">{fmt(rawMaterials.bxt_s1.receipt + rawMaterials.bxt_s2.receipt + rawMaterials.bxt_s3.receipt)}</td>
                <td className="txt-right font-mono font-bold text-cyan">{fmt(rawMaterials.bxt_s1.stock + rawMaterials.bxt_s2.stock + rawMaterials.bxt_s3.stock)}</td>
                <td className="txt-right font-mono font-bold text-cyan">{fmt(rawMaterials.bxt_s1.consump + rawMaterials.bxt_s2.consump + rawMaterials.bxt_s3.consump)}</td>
              </tr>
              <tr className="sub-row">
                <td className="pl-4 text-muted">└ S1</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.bxt_s1.receipt)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.bxt_s1.stock)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.bxt_s1.consump)}</td>
              </tr>
              <tr className="sub-row">
                <td className="pl-4 text-muted">└ S2</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.bxt_s2.receipt)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.bxt_s2.stock)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.bxt_s2.consump)}</td>
              </tr>
              <tr className="sub-row">
                <td className="pl-4 text-muted">└ S3</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.bxt_s3.receipt)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.bxt_s3.stock)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.bxt_s3.consump)}</td>
              </tr>
              <tr className="border-top">
                <td className="font-bold">Fuel Oil (FO)</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.fo.receipt)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.fo.stock)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.fo.consump)}</td>
              </tr>
              <tr>
                <td className="font-bold">Coal</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.coal.receipt)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.coal.stock)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.coal.consump)}</td>
              </tr>
              <tr>
                <td className="font-bold">Natural Gas (NG) <span className="unit">Nm³</span></td>
                <td className="txt-right font-mono">{fmt(rawMaterials.ng.receipt)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.ng.stock)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.ng.consump)}</td>
              </tr>
              <tr>
                <td className="font-bold">Biomass</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.biomass.receipt)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.biomass.stock)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.biomass.consump)}</td>
              </tr>
            </tbody>
          </table>
          <div className="quality-header">Material Quality Indicators</div>
          <div className="quality-grid">
            <div className="q-item">
              <span className="lbl">Bxt Moisture</span>
              <span className="val font-mono">{rawMaterials.quality.bxt_moisture}%</span>
            </div>
            <div className="q-item border-left">
              <span className="lbl">Bxt Silica</span>
              <span className="val font-mono">{rawMaterials.quality.bxt_silica}%</span>
            </div>
            <div className="q-item border-left">
              <span className="lbl">Coal GCV</span>
              <span className="val font-mono">{rawMaterials.quality.coal_gcv} <span className="unit">kcal</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. CO-GENERATION, CPP & ENGINEERING */}
      <div className="uh-card power-card">
        <div className="uh-card-header">

          <h3>Power & Engineering</h3>
        </div>
        <div className="power-sections-grid">
          {/* CGPP */}
          <div className="power-tile">
            <h4>CGPP Power House</h4>
            <div className="tile-row">
              <span className="lbl">Turbine Load:</span>
              <span className="val font-mono text-green">{powerEngg.cgpp.load_mw} MW</span>
            </div>
            <div className="tile-row">
              <span className="lbl">Steam Flow:</span>
              <span className="val font-mono text-cyan">{fmt(powerEngg.cgpp.steam_flow)} t/h</span>
            </div>
          </div>
          {/* CPP */}
          <div className="power-tile border-top-mobile">
            <h4>CPP Power House</h4>
            <div className="tile-row">
              <span className="lbl">Turbine Load:</span>
              <span className="val font-mono text-green">{powerEngg.cpp.load_mw} MW</span>
            </div>
            <div className="tile-row">
              <span className="lbl">Aux Power:</span>
              <span className="val font-mono text-danger">{powerEngg.cpp.aux_power} MW</span>
            </div>
          </div>
          {/* Maintenance Engineering */}
          <div className="power-tile border-top">
            <h4>Engineering Maintenance</h4>
            <div className="tile-row">
              <span className="lbl">PM Adherence:</span>
              <span className="val font-mono text-green">{powerEngg.engg.pm_adh_pct}%</span>
            </div>
            <div className="tile-row">
              <span className="lbl">Equipment Availability:</span>
              <span className="val font-mono text-cyan">{powerEngg.engg.avail_pct}%</span>
            </div>
          </div>
          {/* PPT ATH */}
          <div className="power-tile border-top border-left-mobile">
            <h4>PPT ATH Target</h4>
            <div className="tile-row">
              <span className="lbl">Today Target:</span>
              <span className="val font-mono text-green">{fmt(powerEngg.ppt_ath.today)} T</span>
            </div>
            <div className="tile-row">
              <span className="lbl">MTD Accum:</span>
              <span className="val font-mono text-cyan">{fmt(powerEngg.ppt_ath.mtd)} T</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
