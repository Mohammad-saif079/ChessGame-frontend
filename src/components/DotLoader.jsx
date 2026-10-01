import { useEffect, useState } from "react";

function DotLoader() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length === 3 ? "" : prev + "."));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return <span>{dots}</span>;
}

export default DotLoader;