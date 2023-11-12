import { useState, FormEvent, useEffect, useContext } from "react";
import { isValidFENotation } from "@/lib/utils/chess-utils";
import { ChessBoard } from "@/components/ChessBoard";
import useLocalStorage from "@/lib/hooks/use-localstorage";
import { SoundContext, SoundContextType } from "./contexts/Sound";
import { TipsDialog } from "@/components/TipsDialog";
import { Button } from "@/components/ui/Buttton";
import { Kbd } from "@/components/ui/Kbd";
import cn from "@/lib/cn";
import SoundOff from "@assets/Icons/SoundOff.svg?react";
import SoundOn from "@assets/Icons/SoundOn.svg?react";
import DHIS2Logo from "@assets/DHIS2-logo.svg?react";
import Info from "@assets/Icons/Info.svg?react";
import useKeyboardShortcut from "./lib/hooks/use-keyboard-shortcut";
import { useTheme } from "./contexts/Theme";
import { motion } from "framer-motion";

export const DEFAULT_FEN = "r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1";

const FEN_SUGGESTIONS = [
  "1k1k3r/2bpBpNp/b4n2/1p1BP2P/1PR5/8/R3K3/6b1",
  "r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1",
  "r2k3r/p1bpBpNp/b3qn2/1p1BP2P/6P1/3R4/R3K3/6b1",
  "1k1k3r/2b1BpNp/b7/1p2P2P/1PR5/8/R3K3/6bB",
  "1p1p3r/2bpQpNp/b4n2/1p1BP2P/1RN5/8/N3P3/6q1",
];

const App = () => {
  const [minimalFen, setMinimalFen] = useLocalStorage(
    "FEN-Notation",
    DEFAULT_FEN
  );
  const [inputValue, setInputValue] = useState("");
  const [isInputValid, setIsInputValid] = useState(true);
  const { soundEnabled, toggleSound, playSound } = useContext(
    SoundContext
  ) as SoundContextType;

  const { theme, changeTheme, themeKey } = useTheme();

  useKeyboardShortcut("Shift+R", () => addValidSuggestion());
  useKeyboardShortcut("Shift+T", () => changeTheme());

  useEffect(() => {
    setInputValue(minimalFen);
  }, [minimalFen]);

  const onInputChange = (event: FormEvent<HTMLInputElement>): void => {
    setInputValue(event.currentTarget.value);

    if (isValidFENotation(event.currentTarget.value)) {
      setIsInputValid(true);
      setMinimalFen(event.currentTarget.value);
    } else {
      setIsInputValid(false);
    }
  };

  const addValidSuggestion = () => {
    playSound("RANDOM_FEN");

    const randomIndex = Math.floor(Math.random() * FEN_SUGGESTIONS.length);
    const randomFen = FEN_SUGGESTIONS[randomIndex];

    setInputValue(randomFen);
    setMinimalFen(randomFen);
    setIsInputValid(true);
  };

  return (
    <div
      className="flex w-full h-screen items-center flex-col"
      data-current-theme={themeKey}
    >
      <div className="w-full fixed top-0">
        <div className={cn("h-2", theme.primary)} />
        <div className="flex justify-end pr-2">
          <Button
            variant="ghost"
            size="icon"
            aria-checked={soundEnabled}
            aria-label={soundEnabled ? "Disable Sound" : "Enable Sound"}
            role="switch"
            onClick={toggleSound}
            className="p-2 rounded-full text-gray-800"
          >
            {soundEnabled ? <SoundOff /> : <SoundOn />}
          </Button>
        </div>
      </div>
      <div className="md:mt-10 p-5 md:p-0 ">
        <DHIS2Logo />
        <div className="flex flex-col pb-2 pt-10">
          <div className="flex justify-between">
            <label
              htmlFor="fen-input"
              className="text-sm py-1 font-bold flex items-center"
            >
              FEN NOTATION{" "}
              <a
                target="_blank"
                className="hover:text-link h-3 w-3 m-1"
                href="https://www.chess.com/terms/fen-chess#how-does-fen-work"
                aria-label="Read more about FEN notation"
              >
                <Info />
              </a>
            </label>

            <Button
              className="p-0 text-gray-600"
              variant="link"
              size="sm"
              onClick={addValidSuggestion}
            >
              Generate Random
            </Button>
          </div>
          <input
            placeholder="Enter FEN notation"
            value={inputValue}
            spellCheck={false}
            className={cn(
              "border border-input placeholder:font-sans p-2 mb-1 font-mono rounded ring-offset-background focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2",
              {
                "border-red-400": !isInputValid,
              }
            )}
            onChange={onInputChange}
          />

          {!isInputValid && (
            <motion.div
              initial={{ opacity: 0, x: -10, y: -10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              className="text-xs italic text-red-400"
            >
              The FEN is invalid! click{" "}
              <em className="font-bold">'Generate Random'</em> for a valid FEN
            </motion.div>
          )}
        </div>
        {/* Making the Movement of the boxes less Janky */}
        <motion.div
          transition={{ type: "tween" }}
          animate={!isInputValid ? { y: -5 } : { y: 0 }}
          className="shadow p-3 border rounded"
        >
          <ChessBoard
            fen={minimalFen}
            onChange={setMinimalFen}
            /**We are still show the previous valid FEN representation when user input a wrong FEN value
             * So it makes sense to do prevent the user from clicking the cell when the FEN is invalid
             */
            disabled={!isInputValid}
          />
        </motion.div>
        <div className="py-5 text-sm flex justify-center items-center text-gray-600">
          <p>
            <span>Proudly made in 🇳🇬 </span>
            <span>by Jude Agboola </span>
          </p>
          <span className="mx-1">•</span>
          <a
            className="text-link underline"
            href="https://github.com/marvinjude/chess-tournament"
          >
            View source
          </a>
        </div>
      </div>

      <div className="fixed bottom-0 right-0 pr-10 pb-10">
        <TipsDialog
          items={[
            () => (
              <>
                Borerd of the colors 🙂? Change the theme by pressing{" "}
                <Kbd>Shift</Kbd> + <Kbd>T</Kbd> keys.
              </>
            ),
            () => (
              <>
                <em className="font-bold">Double tap </em>on any piece to change
                to another piece of the same color
              </>
            ),

            () => (
              <>
                Change the board by entering any valid FEN notation in the input
                field
              </>
            ),
            () => (
              <>
                Change the board to a random valid FEN notation by clicking the{" "}
                <Kbd>Shift</Kbd> + <Kbd>R</Kbd> keys
              </>
            ),
            () => (
              <>
                To move a piece, click on it and click on the square you want to
                move it to
              </>
            ),
          ]}
        />
      </div>
    </div>
  );
};

export default App;
