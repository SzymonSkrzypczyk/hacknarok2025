import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Check, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
    const { theme, setTheme, themes, currentTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);

    // Mount effect to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Return a placeholder with the same dimensions to avoid layout shift
        return <div className="h-8 w-[150px]" />;
    }

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1 font-runic">
                        <span className="text-lg mr-1" style={{ color: currentTheme.color }}>
                            {currentTheme.runeSymbol}
                        </span>
                        <span>{currentTheme.label}</span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-60">
                    <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
                    <div className="grid grid-cols-3 gap-1 p-1">
                        {themes.map((t) => (
                            <DropdownMenuItem
                                key={t.name}
                                onClick={() => {
                                    setTheme(t.name);
                                    setOpen(false);
                                }}
                                className={cn(
                                    "flex flex-col items-center justify-center h-20 p-2 cursor-pointer hover:bg-accent transition-all",
                                    theme === t.name && "bg-accent/50"
                                )}
                            >
                                <div
                                    className="h-10 w-10 flex items-center justify-center rounded-md mb-1 font-runic text-2xl"
                                    style={{
                                        color: t.color,
                                        textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                                        backgroundColor: "rgba(0,0,0,0.2)",
                                        border: theme === t.name ? `2px solid ${t.color}` : "1px solid transparent",
                                    }}
                                >
                                    {t.runeSymbol}
                                </div>
                                <span className="text-xs font-medium text-center">{t.label}</span>
                                {theme === t.name && <Check className="h-3 w-3 absolute top-1 right-1 text-primary" />}
                            </DropdownMenuItem>
                        ))}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
