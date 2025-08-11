import React, { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { realSphericalHarmonic } from '../sh'

function DeformSphere({ l, m, amplitude, mode }) {
  const meshRef = useRef()
  // geometry resolution
  const widthSegments = 80
  const heightSegments = 80

  const geometry = useMemo(() => {
    const geom = new THREE.SphereGeometry(1, widthSegments, heightSegments)
    // compute and add uv or custom attributes as needed
    return geom
  }, [])

  useEffect(() => {
    if (!geometry) return
    // keep a copy of original positions
    geometry.userData.original = geometry.attributes.position.array.slice()
  }, [geometry])

  useFrame(() => {
    if (!geometry) return
    const pos = geometry.attributes.position.array
    const orig = geometry.userData.original
    const count = pos.length / 3

    // find min/max for color normalization
    let minv = Infinity, maxv = -Infinity
    const values = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const ox = orig[3 * i]
      const oy = orig[3 * i + 1]
      const oz = orig[3 * i + 2]
      const r = Math.sqrt(ox * ox + oy * oy + oz * oz)
      // convert to spherical coords
      const theta = Math.acos(oz / r) // [0,π]
      const phi = Math.atan2(oy, ox) // [-π,π]
      const val = realSphericalHarmonic(l, m, theta, (phi < 0 ? phi + 2 * Math.PI : phi))
      values[i] = val
      if (val < minv) minv = val
      if (val > maxv) maxv = val
    }

    // color attribute
    if (!geometry.attributes.color) {
      const colors = new Float32Array(count * 3)
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    }
    const colors = geometry.attributes.color.array

    for (let i = 0; i < count; i++) {
      const val = values[i]
      const t = (val - minv) / (maxv - minv + 1e-12)
      // simple blue-white-red map
      const rcol = Math.max(0, Math.min(1, 2 * (t - 0.5)))
      const bcol = Math.max(0, Math.min(1, 2 * (0.5 - t)))
      const gcol = 1 - Math.abs(2 * t - 1)
      // displacement
      const ox = orig[3 * i]
      const oy = orig[3 * i + 1]
      const oz = orig[3 * i + 2]
      const norm = Math.sqrt(ox * ox + oy * oy + oz * oz)
      let disp = 0
      if (mode === 'displacement' || mode === 'both') {
        disp = amplitude * values[i]
      }
      const factor = (1 + disp)
      pos[3 * i] = ox * factor
      pos[3 * i + 1] = oy * factor
      pos[3 * i + 2] = oz * factor

      colors[3 * i] = rcol
      colors[3 * i + 1] = gcol
      colors[3 * i + 2] = bcol
    }

    geometry.attributes.position.needsUpdate = true
    geometry.attributes.color.needsUpdate = true
    geometry.computeVertexNormals()
  })

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial vertexColors={true} roughness={0.5} metalness={0.0} />
    </mesh>
  )
}

export default function SphereView({ n, m, amplitude, mode }) {
  return (
    <Canvas camera={{ position: [0, 0, 3.5] }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <DeformSphere l={n} m={m} amplitude={amplitude} mode={mode} />
      <OrbitControls />
    </Canvas>
  )
}
