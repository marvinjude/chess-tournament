import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import cn from "@lib/cn";
import { CellPosition } from "@lib/utils/chess-utils";

const cellVariants = cva(
  "flex bg-white text-xl md:text-4xl items-center justify-center cursor-pointer select-none aspect-square ring-offset-background focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "",
        selected: "border-2 border-blue-500",
        disabled: "cursor-not-allowed opacity-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CellProps
  extends Omit<
      React.HTMLAttributes<HTMLButtonElement>,
      "onClick" | "onDoubleClick"
    >,
    VariantProps<typeof cellVariants> {
  asChild?: boolean;
  col: number;
  row: number;
  onClick: (cell: CellPosition) => void;
  onDoubleClick: (cell: CellPosition) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
}

const Cell = React.forwardRef<HTMLButtonElement, CellProps>(
  (
    {
      variant,
      className,
      col,
      row,
      onClick,
      onDoubleClick,
      onKeyDown,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        role="button"
        aria-label={`chessboard cell in row ${row} and column ${col}`}
        tabIndex={0}
        ref={ref}
        className={cn(cellVariants({ variant, className }))}
        onDoubleClick={() => onDoubleClick({ col, row })}
        onKeyDown={onKeyDown}
        onClick={() =>
          onClick({
            col,
            row,
          })
        }
        {...props}
      >
        {children}
      </button>
    );
  }
);

export { Cell };
