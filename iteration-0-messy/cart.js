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
  // Fixed 2026-11-05: used to splice()+return on the FIRST match only, so a
  // name added twice kept its second entry. Now removes every entry with
  // that name, matching iteration-1's filter()-based removeItem (see
  // SUMMARY.md). Mutates `c` in place (iterating backwards while splicing)
  // instead of reassigning it, because `c` is exported by reference and a
  // reassignment here would not be visible on the exported property.
  for (let i = c.length - 1; i >= 0; i--) {
    if (c[i].n == n) {
      c.splice(i, 1);
    }
  }
}

module.exports = { a, calc, rm, c };
