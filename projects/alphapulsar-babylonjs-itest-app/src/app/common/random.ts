export function randi(v: number) {
  return Math.floor(Math.random() * v);
}

export function randc(v: number): number {
  return v / 2 - Math.random() * v;
}

export function randAxis(): number {
  let v = randi(3);
  if (randi(2)) {
    v = -v;
  }
  return v;
}
