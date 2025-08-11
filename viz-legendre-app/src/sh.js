import { factorial } from './legendre'
import { associatedLegendre } from './legendre'

// normalization constant N_{l,m} = sqrt((2l+1)/(4π) * (l-m)!/(l+m)!)
export function shNormalization(l, m) {
  const num = (2 * l + 1) * factorial(l - Math.abs(m))
  const den = 4 * Math.PI * factorial(l + Math.abs(m))
  return Math.sqrt(num / den)
}

// compute real spherical harmonic (orthonormal) value Y_{l}^{m,real}(theta,phi)
// theta in [0,π], phi in [0,2π]
// using the real form:
// m > 0: sqrt(2) * N * P_l^m(cosθ) * cos(mφ)
// m = 0: N * P_l^0(cosθ)
// m < 0: sqrt(2) * N * P_l^{|m|}(cosθ) * sin(|m|φ)  (note: sign conventions vary)

export function realSphericalHarmonic(l, m, theta, phi) {
  const absm = Math.abs(m)
  const x = Math.cos(theta)
  const P = associatedLegendre(l, absm, x)
  const N = shNormalization(l, absm)
  if (m === 0) {
    return N * P
  }
  const pref = Math.sqrt(2) * N * P
  if (m > 0) {
    return pref * Math.cos(m * phi)
  } else {
    return pref * Math.sin(absm * phi)
  }
}
