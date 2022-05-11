import { useCallback, useMemo } from "react";

export const useSound = (path: string) => {
  const sound = useMemo(() => {
    if (typeof Audio == "undefined") return null; // if we're server-side
    const audio = new Audio(path);
    audio.volume = 0.5;
    return audio;
  }, [path]);

  const play = useCallback(async () => {
    if (sound) await sound.play();
  }, [sound]);

  return useMemo(() => [play], [play]);
};
