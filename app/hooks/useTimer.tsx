import { useEffect, useMemo, useState } from "react";

export const useTimer = (initTime: number, onEnd?: () => void): string => {
  const [time, setTime] = useState(initTime);

  useEffect(() => {
    const countdown = setTimeout(() => {
      setTime((pastTime) => {
        if (pastTime - 1) {
          return pastTime - 1;
        }
        if (onEnd) onEnd();
        return 0;
      });
    }, 1000);

    return () => clearTimeout(countdown);
  });

  return useMemo(
    () => new Date(time * 1000).toISOString().slice(14, 19),
    [time]
  );
};
