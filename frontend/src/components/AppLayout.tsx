import React, { useEffect } from "react";
import { SidebarContent } from "@/components/SidebarContent";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = React.useState(true);
    const isMobile = useIsMobile();

    // Auto close sidebar on mobile
    useEffect(() => {
        setSidebarOpen(!isMobile);
    }, [isMobile]);

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-sidebar border-r border-border transition-all duration-300 ease-in-out",
                    sidebarOpen ? "w-64" : "w-0",
                    "fixed md:relative z-40 h-full overflow-hidden"
                )}
            >
                <div className={cn("h-full w-64 transition-all duration-300", !sidebarOpen && "opacity-0")}>
                    <SidebarContent />
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-auto transition-all duration-300">
                <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
                    <div className="flex h-14 items-center px-4">
                        <Button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            variant="ghost"
                            size="icon"
                            className="mr-4 text-muted-foreground hover:bg-accent"
                            aria-label="Toggle Sidebar"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </div>
                </div>

                {children}
            </main>
        </div>
    );
}
