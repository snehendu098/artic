import { useState, useEffect } from "react";
import { getProtocols } from "@/actions/protocol.actions";

interface Tool {
  name: string;
  description: string;
}

export interface Protocol {
  name: string;
  description: string;
  tools: Tool[];
}

export const useProtocols = () => {
  const [data, setData] = useState<Protocol[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProtocols().then((protocols) => {
      setData(protocols);
      setIsLoading(false);
    });
  }, []);

  return { data, isLoading };
};
