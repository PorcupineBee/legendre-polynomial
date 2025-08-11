// utilities for factorial and double factorial
export function factorial(n) {
  if (n < 0) throw new Error('negative factorial')
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

export function doubleFactorial(n) {
  if (n <= 0) return 1
  let r = 1
  for (let i = n; i > 0; i -= 2) r *= i
  return r
}

// compute associated Legendre P_n^m(x) for all n up to nMax for a fixed m
// returns array P[n] for n >= m
export function computeAssociatedLegendreForM(nMax, m, x) {
  // Ensure |x| <= 1
  const eps = 1e-12
  if (x > 1) x = 1
  if (x < -1) x = -1

  const P = []
  // P_m^m(x) = (-1)^m (2m-1)!! (1-x^2)^{m/2}
  const pmm = ((m % 2) === 0 ? 1 : -1) * doubleFactorial(2 * m - 1) * Math.pow(1 - x * x, m / 2)
  P[m] = pmm

  if (nMax === m) return P

  // P_{m+1}^m(x) = x (2m+1) P_m^m(x)
  P[m + 1] = x * (2 * m + 1) * P[m]

  // recurrence for n >= m+1:
  // (n - m + 1) P_{n+1}^m = (2n+1) x P_n^m - (n + m) P_{n-1}^m
  for (let n = m + 1; n < nMax; n++) {
    const a = (2 * n + 1) * x * P[n]
    const b = (n + m) * P[n - 1]
    P[n + 1] = (a - b) / (n - m + 1)
  }
  return P
}

// single value P_n^m(x)
export function associatedLegendre(n, m, x) {
  if (m < 0 || m > n) return 0
  const arr = computeAssociatedLegendreForM(n, m, x)
  return arr[n] ?? 0
}
