import * as React from "react";
import { cn } from "@/lib/utils";

const TabsContext = React.createContext({
  value: "",
  onValueChange: () => {},
});

export function Tabs({ value, onValueChange, defaultValue, className, children, ...props }) {
  const [currentValue, setCurrentValue] = React.useState(defaultValue || "");
  const activeValue = value !== undefined ? value : currentValue;
  const handleValueChange = onValueChange || setCurrentValue;

  return (
    <TabsContext.Provider value={{ value: activeValue, onValueChange: handleValueChange }}>
      <div className={cn("w-full space-y-4", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }) {
  return (
    <div
      className={cn(
        "inline-flex h-12 items-center justify-start rounded-xl bg-slate-900/80 p-1 text-slate-400 border border-slate-800 w-full overflow-x-auto no-scrollbar scroll-smooth",
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ value, className, children, ...props }) {
  const context = React.useContext(TabsContext);
  const isSelected = context.value === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      onClick={() => context.onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs md:text-sm font-semibold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer flex-1 min-w-max",
        isSelected
          ? "bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/80"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children, ...props }) {
  const context = React.useContext(TabsContext);
  if (context.value !== value) return null;

  return (
    <div
      role="tabpanel"
      className={cn("focus-visible:outline-none animate-in fade-in-50 duration-200", className)}
      {...props}
    >
      {children}
    </div>
  );
}
