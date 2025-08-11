import React, { useState } from 'react';
import Controls from './components/Controls';
import Plot2D from './components/Plot2D';
import SphereView from './components/SphereView';
import { associatedLegendre } from './legendre';
import Plot from 'react-plotly.js';

export default function App() {
  const [n, setN] = useState(3);
  const [m, setM] = useState(1);
  const [mode, setMode] = useState('both');
  const [amplitude, setAmplitude] = useState(0.25);

  // Generate data for static plot
  const staticPlotData = React.useMemo(() => {
    const N = 200;
    const theta = new Array(N).fill(0).map((_, i) => i * Math.PI / (N - 1));
    return Array.from({ length: 5 }, (_, ni) => ({
      x: theta,
      y: theta.map(t => associatedLegendre(ni, 0, Math.cos(t))),
      name: `P_${ni}(cosθ)`,
      type: 'scatter'
    }));
  }, []);

  return (
    <div className="app">
      {/* ... rest of your JSX remains the same until the static plot part ... */}
      <div className="left panel">
        <Controls
          n={n} setN={setN}
          m={m} setM={setM}
          mode={mode} setMode={setMode}
          amplitude={amplitude} setAmplitude={setAmplitude}
        />
        <div style={{marginTop: 12}}>
          <h4>Notes</h4>
          <p style={{fontSize: 12}}>Real spherical harmonics, orthonormal normalization. n up to 8 works fine; UI limited to keep mesh small.</p>
        </div>
      </div>

      <div className="right">
        <div className="panel" style={{display:'flex', gap:12}}>
          <div style={{flex: 1}}>
            <h4>2D: Associated Legendre</h4>
            <Plot2D n={n} m={m} />
          </div>

          <div style={{width: 500}}>
            <h4 style={{marginTop: 0}}>3D: Spherical Harmonic</h4>
            <div className="canvas" style={{height: 420}}>
              <SphereView n={n} m={m} amplitude={amplitude} mode={mode} />
            </div>
          </div>
        </div>

      <div className="panel">
        <h4>All P_n(x) (n=0..4)</h4>
        <Plot
          data={staticPlotData}
          layout={{
            margin: { t: 10, l: 40, r: 10, b: 40 },
            height: 250,
            legend: { orientation: 'h' }
          }}
          config={{ displayModeBar: false }}
        />
      </div>
      <div className="panel footer">
          <h4>Equation & Table</h4>
          <p style={{fontSize: 13}}>This app uses the associated Legendre recurrence:
            <br/>(n - m + 1) P_{n+1}^m = (2n+1) x P_n^m - (n+m) P_{n-1}^m<br/>
            and P_m^m(x) = (-1)^m (2m-1)!! (1-x^2)^{m/2}.
          </p>
          <p style={{fontSize: 13}}>Real spherical harmonics are formed as:
            <br />Y<sub>l,m</sub><sup>real</sup>(θ,φ) = N * P<sub>l</sub><sup>|m|</sup>(cosθ) * {`( sqrt(2) cos(mφ) or sqrt(2) sin(|m|φ) )`} for m ≠ 0 (m sign chooses cos/sin).
          </p>
        </div>
      </div>

    </div>
  );
}