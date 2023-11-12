import useLocalStorage from "@/lib/hooks/use-localstorage";
import { createContext, useContext } from "react";

const sounds = {
  CELL_CLICK: "click.mp3",
  RANDOM_FEN: "random.mp3",
  SWITCH: "switch.mp3",
  MOVE: "move.mp3",
};

export type SoundContextType = {
  soundEnabled: boolean;
  toggleSound: () => void;
  playSound: (type: keyof typeof sounds) => void;
};

export const SoundContext = createContext<SoundContextType | null>(null);

export const useSound = () => {
  const context = useContext(SoundContext);

  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }

  return context;
};

export const SoundContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [soundEnabled, setSoundEnabled] = useLocalStorage(
    "soundEnabled",
    false
  );

  const toggleSound = () => {
    if (!soundEnabled) playSound("SWITCH");

    setSoundEnabled(!soundEnabled);
  };

  const playSound = (type: keyof typeof sounds) => {
    const soundsDir = "sounds";
    const audio = new Audio(`${soundsDir}/${sounds[type]}`);

    audio.play();
  };

  const playSoundWithAllowanceCheck = (type: keyof typeof sounds) => {
    if (!soundEnabled) return;

    playSound(type);
  };

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        toggleSound,
        playSound: playSoundWithAllowanceCheck,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};
