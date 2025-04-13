import React from "react";
import {
    LayoutDashboard,
    Settings,
    LogOut,
    Twitter,
    Facebook,
    Instagram,
    Linkedin,
    MessageCircle,
    Users,
    RefreshCw,
    Bell,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/components/UserProfile";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useToast } from "@/hooks/use-toast";
import { useData, SocialPlatform } from "@/contexts/DataContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Badge } from "@/components/ui/badge";

export function SidebarContent() {
    const { toast } = useToast();
    const { filteredPlatform, setFilteredPlatform, getAllPlatforms } = useData();
    const { currentTheme } = useTheme();

    const handleLogout = () => {
        toast({
            title: "Logged out",
            description: "You have been logged out successfully",
        });
    };

    const handleRefresh = () => {
        toast({
            title: "Refreshed",
            description: "Dashboard data has been refreshed",
        });
    };

    // Get all available platforms
    const availablePlatforms = getAllPlatforms();

    // Platform icon mapping
    const platformIcons: Record<SocialPlatform, React.ElementType> = {
        twitter: Twitter,
        facebook: Facebook,
        instagram: Instagram,
        linkedin: Linkedin,
    };

    // Get runic symbols for buttons
    const runeMap: Record<string, string> = {
        dashboard: "ᛘ", // Mannaz
        refresh: "ᚱ", // Raido
        notifications: "ᚾ", // Naudiz
        team: "ᛏ", // Tiwaz
        settings: "ᛊ", // Sowilo
        logout: "ᛚ", // Laguz
    };

    // Handle platform filter click
    const handlePlatformClick = (platform: SocialPlatform) => {
        if (filteredPlatform === platform) {
            setFilteredPlatform(null); // Clear filter if clicking the active platform
        } else {
            setFilteredPlatform(platform);
        }
    };

    // Set accent color style based on current theme
    const getAccentStyle = () => {
        return {
            "--accent-color": currentTheme.color,
        } as React.CSSProperties;
    };

    return (
        <div className="flex flex-col h-full py-4">
            {/* Static header - outside scroll area */}
            <div className="px-4 mb-6 flex-shrink-0">
                <img src="../../public/summarizze-logo.svg" className="pb-4"></img>
                <p className="text-xs text-muted-foreground">Social Media Dashboard</p>
            </div>

            <div className="px-2 mb-4 flex-shrink-0">
                <Button
                    variant="default"
                    className="w-full justify-start btn-accent btn-runic"
                    size="sm"
                    onClick={() => setFilteredPlatform(null)}
                    data-rune={runeMap.dashboard}
                    style={getAccentStyle()}
                >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                </Button>
            </div>

            {/* Scrollable content section */}
            <ScrollArea className="flex-grow px-2">
                <div className="pr-2">
                    {" "}
                    {/* Extra right padding for the scrollbar */}
                    <div className="px-2 py-2 flex justify-between items-center">
                        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Connected Platforms
                        </h2>
                        {filteredPlatform && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 px-1 py-0 text-xs"
                                onClick={() => setFilteredPlatform(null)}
                            >
                                <X className="h-3 w-3 mr-1" />
                                Clear
                            </Button>
                        )}
                    </div>
                    <nav className="space-y-1 mt-1">
                        {[
                            {
                                name: "Huginn / X",
                                platform: "twitter" as SocialPlatform,
                                active: availablePlatforms.includes("twitter"),
                            },
                            {
                                name: "Odyn / Facebook",
                                platform: "facebook" as SocialPlatform,
                                active: availablePlatforms.includes("facebook"),
                            },
                            {
                                name: "Thor / Instagram",
                                platform: "instagram" as SocialPlatform,
                                active: availablePlatforms.includes("instagram"),
                            },
                            {
                                name: "Loki / LinkedIn",
                                platform: "linkedin" as SocialPlatform,
                                active: availablePlatforms.includes("linkedin"),
                            },
                        ].map((platformItem) => {
                            const PlatformIcon = platformIcons[platformItem.platform];
                            const isSelected = filteredPlatform === platformItem.platform;

                            return (
                                <Button
                                    key={platformItem.name}
                                    variant={isSelected ? "default" : "ghost"}
                                    className={cn(
                                        "w-full justify-start",
                                        platformItem.active ? "text-foreground" : "text-muted-foreground",
                                        isSelected && "btn-accent",
                                        isSelected && "text-white"
                                    )}
                                    style={isSelected ? getAccentStyle() : {}}
                                    size="sm"
                                    disabled={!platformItem.active}
                                    onClick={() => handlePlatformClick(platformItem.platform)}
                                >
                                    <PlatformIcon className="mr-2 h-4 w-4" />
                                    {platformItem.name}
                                    {isSelected && (
                                        <Badge variant="outline" className="ml-auto">
                                            Active
                                        </Badge>
                                    )}
                                    {!platformItem.active && (
                                        <span className="ml-auto text-xs bg-secondary text-secondary-foreground rounded px-1">
                                            Off
                                        </span>
                                    )}
                                </Button>
                            );
                        })}
                    </nav>
                    <div className="mt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start btn-runic"
                            data-rune={runeMap.refresh}
                            onClick={handleRefresh}
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refresh Data
                        </Button>
                    </div>
                    <div className="px-2 py-2 mt-4">
                        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Account
                        </h2>
                    </div>
                    <nav className="space-y-1">
                        <Button
                            variant="ghost"
                            className="w-full justify-start btn-runic"
                            data-rune={runeMap.notifications}
                            size="sm"
                        >
                            <Bell className="mr-2 h-4 w-4" />
                            Notifications
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start btn-runic"
                            data-rune={runeMap.team}
                            size="sm"
                        >
                            <Users className="mr-2 h-4 w-4" />
                            Team Access
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start btn-runic"
                            data-rune={runeMap.settings}
                            size="sm"
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Button>
                    </nav>
                    {/* Add some extra padding at the bottom for better scrolling */}
                    <div className="h-4" />
                </div>
            </ScrollArea>

            {/* Static footer - outside scroll area */}
            <div className="mt-4 flex-shrink-0">
                <div className="px-2">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500 btn-runic"
                        data-rune={runeMap.logout}
                        size="sm"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                    </Button>
                </div>

                <Separator className="my-4" />

                <div className="px-2 flex items-center justify-between">
                    <UserProfile />
                    <ThemeSwitcher />
                </div>
            </div>
        </div>
    );
}
