import { useEffect, useMemo, useState } from "react";

export const useTimer = (initTime: number): string => {
  const [time, setTime] = useState(initTime);

  useEffect(() => {
    const countdown = setTimeout(() => {
      setTime((pastTime) => pastTime - 1);
    }, 1000);

    return () => clearTimeout(countdown);
  });

  return useMemo(
    () => new Date(time * 1000).toISOString().slice(14, 19),
    [time]
  );
};
