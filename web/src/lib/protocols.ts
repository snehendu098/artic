export const getProtocolLogoPath = (protocol: string): string => {
  const normalized = protocol.toLowerCase();
  const extension = normalized === "lendle" ? "jpg" : "png";
  return `/protocols/${normalized}.${extension}`;
};
