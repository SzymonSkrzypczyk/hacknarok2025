import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SocialPlatformIcon } from "@/components/SocialPlatformIcon";
import { Expand, ExternalLink, Eye, Heart, MessageCircle, Users } from "lucide-react";
import { SummaryComponent } from "@/contexts/DataContext";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

interface SummaryCardProps {
    summary: SummaryComponent;
    onExpand: () => void;
    className?: string;
}

// Dark mode colors for charts
const CHART_COLORS = ["#4299E1", "#38B2AC", "#D69E2E", "#ED8936", "#9F7AEA"];

export function SummaryCard({ summary, onExpand, className }: SummaryCardProps) {
    const { category, summary: summaryText, posts, importantPost } = summary;
    const { currentTheme } = useTheme();

    const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.comments, 0);
    const totalViews = posts.reduce((sum, post) => sum + post.views, 0);

    // Get unique platforms
    const platforms = Array.from(new Set(posts.map((post) => post.platform)));

    return (
        <Card className={cn("dashboard-card", className)}>
            <CardHeader className="dashboard-card-header pb-6">
                <CardTitle className="dashboard-card-title mb-4 font-bold text-3xl">{category}</CardTitle>
                <div className="flex items-center gap-1 flex-wrap">
                    {platforms.map((platform) => (
                        <Badge key={platform} variant="outline" className="flex gap-1 items-center">
                            <SocialPlatformIcon platform={platform} />
                        </Badge>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="dashboard-card-content">
                <p className="text-sm text-muted-foreground">{summaryText}</p>
                <div className="dashboard-card-stats">
                    <div className="dashboard-stat">
                        <Users className="h-4 w-4" />
                        <span className="dashboard-stat-value">{posts.length} Posts</span>
                    </div>
                    <div className="dashboard-stat">
                        <Eye className="h-4 w-4" />
                        <span className="dashboard-stat-value">{totalViews.toLocaleString()} Views</span>
                    </div>
                    <div className="dashboard-stat">
                        <Heart className="h-4 w-4" />
                        <span className="dashboard-stat-value">{totalLikes.toLocaleString()} Likes</span>
                    </div>
                    <div className="dashboard-stat">
                        <MessageCircle className="h-4 w-4" />
                        <span className="dashboard-stat-value">{totalComments.toLocaleString()} Comments</span>
                    </div>
                </div>

                <div className="mt-2">
                    <h4 className="text-sm font-medium mb-2">Most Important Post</h4>
                    <div className="p-2 rounded-md bg-muted/50 text-xs">
                        <div className="flex items-center gap-1 mb-1">
                            <Avatar className="h-5 w-5">
                                <AvatarImage src={importantPost.author.avatar} alt={importantPost.author.name} />
                                <AvatarFallback>{importantPost.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{importantPost.author.name}</span>
                            <SocialPlatformIcon platform={importantPost.platform} className="h-3 w-3" />
                        </div>
                        <p className="line-clamp-2">{importantPost.content}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="dashboard-card-footer relative flex justify-between items-center">
                <Button variant="outline" size="sm" onClick={onExpand}>
                    <Expand className="h-4 w-4 mr-1" />
                    <span className="md:inline hidden">Expand</span>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                    <a href={importantPost.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        <span className="md:inline hidden">View Source</span>
                    </a>
                </Button>
            </CardFooter>
        </Card>
    );
}
