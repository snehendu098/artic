export const getProtocolLogoPath = (protocol: string): string => {
  const logoMap: Record<string, string> = {
    lendle: "lendle.jpg",
    meth: "meth.png",
    okx: "okx.png",
    "pyth network": "pyth.png",
    openocean: "openocean.jpeg",
    "merchant moe": "merchantmoe.png",
    "agni finance": "agni.jpg",
    uniswap: "uniswap.jpg",
  };

  const normalized = protocol.toLowerCase();
  const filename = logoMap[normalized];

  if (filename) {
    return `/protocols/${filename}`;
  }

  // Fallback: first word + .png
  const fallback = normalized.split(" ")[0];
  return `/protocols/${fallback}.png`;
};
