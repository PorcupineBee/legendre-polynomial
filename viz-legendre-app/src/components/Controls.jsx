import React from 'react'

export default function Controls({ n, setN, m, setM, mode, setMode, amplitude, setAmplitude }) {
  return (
    <div>
      <h3>Controls</h3>

      <div className="control-row">
        <label>n</label>
        <input className="small" type="number" min="0" max="10" value={n} onChange={e => setN(parseInt(e.target.value || 0))} />
      </div>

      <div className="control-row">
        <label>m</label>
        <input className="small" type="number" min="0" max={n} value={m} onChange={e => {
          let val = parseInt(e.target.value || 0)
          if (val > n) val = n
          setM(val)
        }} />
      </div>

      <div className="control-row">
        <label>mode</label>
        <select className="select" value={mode} onChange={e => setMode(e.target.value)}>
          <option value="both">Surface + Color</option>
          <option value="displacement">Surface Displacement</option>
          <option value="color">Color mapping</option>
        </select>
      </div>

      <div style={{marginTop: 8}}>
        <label>amplitude</label>
        <input type="range" min="0" max="1.5" step="0.01" value={amplitude} onChange={e => setAmplitude(parseFloat(e.target.value))} />
        <div style={{fontSize: 12}}>{amplitude.toFixed(2)}</div>
      </div>
    </div>
  )
}
