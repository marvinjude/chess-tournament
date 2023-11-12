import { useEffect } from "react";
import { isMobileDevice } from "@lib/utils/app-utils";

/**
 * A hook to listen for a keyboard shortcut and run a callback function. It only works with Shift + key combinations.
 * @param keyCombination - A string representing the key combination to listen for e.g "shift+a"
 * @param action - A function to run when the key combination is pressed
 *
 * Note: Wrote this hook so it doesn't run when user is on mobile or if the user is typing in an input field.
 * Keeping it simple for this assesment
 * Ideally I'd allow a config object in the hook ans determine what to do on mobile or in input fields. ;)
 */
const useKeyboardShortcut = (
  keyCombination: string,
  action: () => void
): void => {
  useEffect(() => {
    if (isMobileDevice()) return;

    const onKeyup = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      const keysPressed = `${e.shiftKey ? "shift" : ""}+${e.key.toLowerCase()}`;

      if (keysPressed === keyCombination.toLowerCase()) {
        action();
      }
    };
    window.addEventListener("keyup", onKeyup);
    return () => window.removeEventListener("keyup", onKeyup);
  }, [action, keyCombination]);
};

export default useKeyboardShortcut;
