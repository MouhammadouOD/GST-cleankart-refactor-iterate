// Iteration 0 — intentionally messy starting point (per the brief).
// Everything global, cryptic names, duplicated discount math, one giant function.

let c = [];

function a(n, p, q, cat) {
  c.push({ n: n, p: p, q: q, cat: cat });
}

function calc(d) {
  let t = 0;
  for (let i = 0; i < c.length; i++) {
    let x = c[i].p * c[i].q;
    if (d == "percent") {
      x = x - x * 0.1;
    } else if (d == "bulk") {
      if (c[i].q >= 5) {
        x = x - x * 0.2;
      } else if (c[i].q >= 3) {
        x = x - x * 0.1;
      }
    }
    t = t + x;
  }
  return t;
}

function rm(n) {
  for (let i = 0; i < c.length; i++) {
    if (c[i].n == n) {
      c.splice(i, 1);
      return;
    }
  }
}

module.exports = { a, calc, rm, c };
