import { useState, useEffect } from "react";

export default function useTypewriter(fullText, charsPerTick = 3, tickMs = 20) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    if (!fullText) {
      setShown("");
      return;
    }
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i += charsPerTick;
      setShown(fullText.slice(0, i));
      if (i >= fullText.length) clearInterval(id);
    }, tickMs);
    return () => clearInterval(id);
  }, [fullText]);

  return shown;
}
