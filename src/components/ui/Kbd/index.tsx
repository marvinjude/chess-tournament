export const Kbd = ({ children }: { children: React.ReactNode }) => {
  return (
    <kbd className="font-mono text-sm bg-gray-200 px-2 rounded border border-b-2 border-gray-300">
      {children}
    </kbd>
  );
};
