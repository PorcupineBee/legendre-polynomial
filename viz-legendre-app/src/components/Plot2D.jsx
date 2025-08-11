import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { associatedLegendre } from '../legendre';

export default function Plot2D({ n, m }) {
  const plotData = useMemo(() => {
    const N = 300;
    const theta = new Array(N).fill(0).map((_, i) => i * Math.PI / (N - 1));
    const y = theta.map(t => associatedLegendre(n, m, Math.cos(t)));

    return [{
      x: theta,
      y,
      mode: 'lines',
      name: `P_${n}^${m}(cosθ)`
    }];
  }, [n, m]);

  return (
    <Plot
      data={plotData}
      layout={{
        margin: { t: 10, l: 40, r: 10, b: 40 },
        xaxis: { title: 'θ (rad)' },
        yaxis: { title: `P_${n}^${m}(cosθ)` }
      }}
      config={{ displayModeBar: false }}
    />
  );
}