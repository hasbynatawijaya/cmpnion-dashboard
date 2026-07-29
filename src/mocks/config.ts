export const mockConfig = {
  latencyMs: 700,
  failOrdersFetch: false,
  failOrderActions: false,
};

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
