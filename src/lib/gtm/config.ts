export interface GtmConfig {
  containerId: string;
  enabled: boolean;
}

export function getGtmConfig(): GtmConfig {
  const containerId = (process.env.NEXT_PUBLIC_GTM_ID ?? '').trim();
  return {
    containerId,
    enabled: /^GTM-[A-Z0-9]+$/i.test(containerId),
  };
}
