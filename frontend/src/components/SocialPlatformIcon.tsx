import React from "react";
import { Twitter, Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";
import { SocialPlatform } from "@/contexts/DataContext";

interface SocialPlatformIconProps {
    platform: SocialPlatform;
    className?: string;
}

export function SocialPlatformIcon({ platform, className = "h-4 w-4" }: SocialPlatformIconProps) {
    switch (platform) {
        case "twitter":
            return <Twitter className={className} />;
        case "facebook":
            return <Facebook className={className} />;
        case "instagram":
            return <Instagram className={className} />;
        case "linkedin":
            return <Linkedin className={className} />;
        default:
            return null;
    }
}
