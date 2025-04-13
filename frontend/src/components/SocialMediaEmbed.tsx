import React from "react";
import { XEmbed, FacebookEmbed, InstagramEmbed, LinkedInEmbed } from "react-social-media-embed";
import { cn } from "@/lib/utils";
import { SocialPlatform } from "@/contexts/DataContext";

interface SocialMediaEmbedProps {
    url: string;
    platform: SocialPlatform;
    width?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
}

export function SocialMediaEmbed({ url, platform, width, height, className, style }: SocialMediaEmbedProps) {
    // Make sure URL is valid before trying to render embeds
    if (!url || !url.startsWith("http")) {
        return null;
    }

    // Select the appropriate embed component based on platform
    switch (platform) {
        case "twitter":
            return (
                <XEmbed
                    url={url}
                    width={width}
                    height={height}
                    className={className}
                    style={style || { width: "100%", height: "auto" }}
                />
            );
        case "facebook":
            return (
                <FacebookEmbed
                    url={url}
                    width={width}
                    height={height}
                    className={className}
                    style={style || { width: "100%", height: "auto" }}
                />
            );
        case "instagram":
            return (
                <InstagramEmbed
                    url={url}
                    width={width}
                    height={height}
                    className={className}
                    style={style || { width: "100%", height: "auto" }}
                />
            );
        case "linkedin":
            return (
                <LinkedInEmbed
                    url={url}
                    width={width}
                    height={height}
                    className={className}
                    style={style || { width: "100%", height: "auto" }}
                />
            );

        default:
            // Fallback - if no matching platform, return nothing
            return null;
    }
}
