export function colorFromGradient(gradient: string): string {
  const match = gradient.match(/#[0-9a-fA-F]{6}/);
  return match ? match[0] : "#f43f5e";
}
