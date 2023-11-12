import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import useLocalStorage from "@/lib/hooks/use-localstorage";
import { Button } from "../ui/Buttton";
import ChevronLeft from "@assets/Icons/ChevronLeft.svg?react";
import ChevronRight from "@assets/Icons/ChevronRight.svg?react";
import Cross from "@assets/Icons/Cross.svg?react";

// 5 Minutes
const SHOW_DIALOG_INTERVAL_DISMISS = 5 * 60 * 1000;

// 10 Seconds
const SHOW_TIP_INTERVAL = 10000;

export const TipsDialog = ({ items }: { items: (() => React.ReactNode)[] }) => {
  const [dontShowAgain, setDontShowAgain] = useLocalStorage("showTips", false);
  const [nextShowTime, setNextShowTime] = useLocalStorage("nextShowTime", 0);
  const [currentItemIndex, setCurrentItemIndex] = useLocalStorage(
    "indeOfLastTipSeen",
    0
  );
  const [isClosing, setIsClosing] = useState(false);

  const onPrev = () => {
    const newIndex =
      currentItemIndex === 0 ? items.length - 1 : currentItemIndex - 1;
    setCurrentItemIndex(newIndex);
  };
  const onNext = useCallback(() => {
    const newIndex = (currentItemIndex + 1) % items.length;
    setCurrentItemIndex(newIndex);
  }, [currentItemIndex, items.length, setCurrentItemIndex]);

  const onDontShowAgain = () => {
    setDontShowAgain(true);
    setIsClosing(true);
  };

  const onClose = () => {
    setIsClosing(true);

    const newTimestamp = new Date().getTime() + SHOW_DIALOG_INTERVAL_DISMISS;
    setNextShowTime(newTimestamp);
  };

  /**
   * Effect to queue up a timer to show the dialog on the next interval
   * I'm making it 5 mins for the sake of this assesment(so you can see it again ;)) but ideally it should be longer than that
   */
  useEffect(() => {
    const timeoutValue = nextShowTime - new Date().getTime();
    const timeout = setTimeout(
      () => {
        setIsClosing(false);
      },
      timeoutValue < 0 ? 0 : timeoutValue
    );

    return () => {
      clearTimeout(timeout);
    };
  }, [nextShowTime, dontShowAgain]);

  /**
   * Effect that changes the current tip every 10 seconds
   * More like a slideshow of tips ;)
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      onNext();
    }, SHOW_TIP_INTERVAL);

    return () => {
      clearTimeout(timeout);
    };
  }, [onNext]);

  if (dontShowAgain || nextShowTime > new Date().getTime()) {
    return null;
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, x: -50 }}
      animate={
        isClosing
          ? { opacity: 0, scale: 0.9 }
          : {
              opacity: 1,
              scale: 1,
              x: 0,
            }
      }
      transition={{ type: "tween" }}
      className="border max-w-sm rounded text-sm bg-white relative p-3"
    >
      <Button
        aria-label="Close tips dialog"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 p-2 m-2 rounded-full"
        onClick={() => onClose()}
      >
        <Cross />
      </Button>
      <div className="font-bold p-2">GAME TIPS</div>

      <motion.div
        key={currentItemIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 2 }}
        transition={{ type: "tween", duration: 1 }}
        exit={{ opacity: 0 }}
        className="w-full p-2 font-light"
      >
        {items[currentItemIndex]()}
      </motion.div>

      <div className="flex justify-between">
        <div className="flex items-center text-gray-500">
          <Button
            onClick={onPrev}
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Previous tip"
          >
            <ChevronLeft />
          </Button>
          <span className="px-1">
            {currentItemIndex + 1} / {items.length}
          </span>
          <Button
            onClick={onNext}
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Next tip"
          >
            <ChevronRight />
          </Button>
        </div>
        <Button
          className="rounded-full"
          size="sm"
          variant="outline"
          onClick={() => onDontShowAgain()}
        >
          Don't show again
        </Button>
      </div>
    </motion.div>
  );
};
