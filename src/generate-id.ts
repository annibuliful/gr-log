export default (pattern: string): string =>
  pattern.replace(/[x]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" || "X" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
