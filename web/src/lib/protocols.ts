export const getProtocolLogoPath = (protocol: string): string => {
  const normalized = protocol.toLowerCase().split(" ")[0];
  const extension = normalized === "lendle" ? "jpg" : "png";
  return `/protocols/${normalized}.${extension}`;
};
