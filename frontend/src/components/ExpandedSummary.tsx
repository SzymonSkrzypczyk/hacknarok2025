import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Label,
    RadialBarChart,
    RadialBar,
} from "recharts";
import { ArrowLeft, ExternalLink, Users, ShieldCheck, Heart, MessageCircle, Eye } from "lucide-react";
import { SummaryComponent, Post } from "@/contexts/DataContext";
import { SocialPlatformIcon } from "@/components/SocialPlatformIcon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { SocialMediaEmbed } from "@/components/SocialMediaEmbed";

interface ExpandedSummaryProps {
    summary: SummaryComponent;
    onCollapse: () => void;
}

export function ExpandedSummary({ summary, onCollapse }: ExpandedSummaryProps) {
    const { category, summary: summaryText, posts, authorDistribution } = summary;
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [themeUpdateKey, setThemeUpdateKey] = useState(0);

    // Add states for delayed believability score calculation
    const [displayedBelievability, setDisplayedBelievability] = useState(0);
    const [isCalculating, setIsCalculating] = useState(true);

    // Process data for charts
    const likesCommentsData = posts.map((post) => ({
        name: post.author.name.split(" ")[0],
        likes: post.likes,
        comments: post.comments,
    }));

    const viewsData = posts.map((post) => ({
        name: post.author.name.split(" ")[0],
        views: post.views,
    }));

    // Format author distribution data for pie chart
    const pieChartData = authorDistribution.map((item) => ({
        author: item.author,
        posts: item.count,
        fill: `var(--color-${item.author.split(" ")[0].toLowerCase()})`,
    }));

    // Calculate total posts and average believability score
    const totalPosts = useMemo(() => {
        return authorDistribution.reduce((acc, curr) => acc + curr.count, 0);
    }, [authorDistribution]);

    // Calculate average believability score
    const averageBelievability = useMemo(() => {
        if (posts.length === 0) return 0;
        const sum = posts.reduce((acc, post) => acc + post.confidentialityScore, 0);
        return Math.round(sum / posts.length);
    }, [posts]);

    // Animate the believability score with a delay
    useEffect(() => {
        if (mounted) {
            setIsCalculating(true);
            setDisplayedBelievability(0);

            // First delay to simulate calculation time
            const calculationTimer = setTimeout(() => {
                // After calculation delay, start incrementing the score
                let current = 0;
                const increment = Math.ceil(averageBelievability / 25); // Divide animation into 25 steps

                const incrementalTimer = setInterval(() => {
                    current += increment;
                    if (current >= averageBelievability) {
                        setDisplayedBelievability(averageBelievability);
                        setIsCalculating(false);
                        clearInterval(incrementalTimer);
                    } else {
                        setDisplayedBelievability(current);
                    }
                }, 40); // 40ms per step = ~1 second total animation

                return () => clearInterval(incrementalTimer);
            }, 800); // Delay before starting calculation

            return () => clearTimeout(calculationTimer);
        }
    }, [averageBelievability, mounted]);

    // Data for average believability radial chart
    const believabilityRadialData = useMemo(() => {
        const score = averageBelievability;
        const color = score >= 70 ? "#22c55e" : score >= 40 ? "#eab308" : "#ef4444";

        return [
            {
                name: "Average",
                value: score,
                fill: color,
            },
        ];
    }, [averageBelievability]);

    // Generate configuration for chart container with explicit names for likes and comments
    const chartConfig = useMemo(
        () => ({
            likes: {
                label: "Likes",
                color: "hsl(var(--chart-series-1))",
            },
            comments: {
                label: "Comments",
                color: "hsl(var(--chart-series-2))",
            },
            views: {
                label: "Views",
                color: "hsl(var(--chart-series-3))",
            },
            ...authorDistribution.reduce((acc, item, index) => {
                const authorKey = item.author.split(" ")[0].toLowerCase();
                return {
                    ...acc,
                    [authorKey]: {
                        label: item.author.split(" ")[0],
                        color: `hsl(var(--chart-series-${(index % 5) + 1}))`,
                    },
                };
            }, {}),
        }),
        [authorDistribution, theme] // Update when theme changes
    );

    // Listen for theme changes
    useEffect(() => {
        const handleThemeChange = () => {
            setThemeUpdateKey((prev) => prev + 1);
        };

        window.addEventListener("themechange", handleThemeChange);
        return () => {
            window.removeEventListener("themechange", handleThemeChange);
        };
    }, []);

    // Handle client-side mounting to prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Force re-render when theme changes
    useEffect(() => {
        if (mounted) {
            setThemeUpdateKey((prev) => prev + 1);
        }
    }, [theme, resolvedTheme, mounted]);

    // Render nothing until mounted on client (prevents hydration mismatch)
    if (!mounted) {
        return <div className="animate-pulse bg-muted h-96 rounded-lg"></div>;
    }

    // Determine the color and text for believability based on the displayed score
    const believabilityColor =
        displayedBelievability >= 70
            ? "text-green-500"
            : displayedBelievability >= 40
            ? "text-yellow-500"
            : "text-red-500";

    const believabilityText =
        displayedBelievability >= 70
            ? "High Trustworthiness"
            : displayedBelievability >= 40
            ? "Medium Trustworthiness"
            : "Low Trustworthiness";

    const believabilityBadgeClass =
        displayedBelievability >= 70
            ? "bg-green-500/10 text-green-500 border-green-500/20"
            : displayedBelievability >= 40
            ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
            : "bg-red-500/10 text-red-500 border-red-500/20";

    const believabilityDescription =
        displayedBelievability >= 70
            ? " a high level of trustworthiness across the posts in this category. These posts generally contain verifiable information from reliable sources."
            : displayedBelievability >= 40
            ? " a moderate level of trustworthiness across the posts. Some information may require additional verification before sharing."
            : " a low level of trustworthiness across these posts. Most content may contain unverified or misleading information.";

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" onClick={onCollapse} className="flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    <span>Back to Dashboard</span>
                </Button>
                <h2 className="text-2xl font-bold">{category}</h2>
            </div>

            {/* Summary Card */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Key Insights</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{summaryText}</p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="engagement" className="mt-2">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                                <TabsTrigger value="views">Views</TabsTrigger>
                            </TabsList>
                            <TabsContent value="engagement" className="mt-4">
                                <div className="h-full" key={`engagement-${themeUpdateKey}`}>
                                    <ChartContainer config={chartConfig}>
                                        <BarChart
                                            data={likesCommentsData}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                            <Legend />
                                            <Bar dataKey="likes" fill={`hsl(var(--chart-series-1))`} name="Likes" />
                                            <Bar
                                                dataKey="comments"
                                                fill={`hsl(var(--chart-series-2))`}
                                                name="Comments"
                                            />
                                        </BarChart>
                                    </ChartContainer>
                                </div>
                            </TabsContent>
                            <TabsContent value="views" className="mt-4">
                                <div className="h-full" key={`views-${themeUpdateKey}`}>
                                    <ChartContainer config={chartConfig}>
                                        <BarChart data={viewsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                            <Legend />
                                            <Bar dataKey="views" fill={`hsl(var(--chart-series-3))`} name="Views" />
                                        </BarChart>
                                    </ChartContainer>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Author Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 pb-0">
                        <ChartContainer
                            config={chartConfig}
                            className="mx-auto aspect-square"
                            key={`pie-${themeUpdateKey}`}
                        >
                            <PieChart>
                                <ChartTooltip
                                    cursor={false}
                                    content={
                                        <ChartTooltipContent
                                            hideLabel
                                            formatter={(value, name, props) => {
                                                return `${name} -  ${value} Posts`;
                                            }}
                                        />
                                    }
                                />
                                <Pie
                                    data={pieChartData}
                                    dataKey="posts"
                                    nameKey="author"
                                    innerRadius={60}
                                    paddingAngle={2}
                                >
                                    <Label
                                        content={({ viewBox }) => {
                                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                return (
                                                    <text
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                    >
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={viewBox.cy}
                                                            className="fill-foreground text-3xl font-bold"
                                                        >
                                                            {totalPosts.toLocaleString()}
                                                        </tspan>
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={(viewBox.cy || 0) + 24}
                                                            className="fill-muted-foreground"
                                                        >
                                                            Posts
                                                        </tspan>
                                                    </text>
                                                );
                                            }
                                        }}
                                    />
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="pt-4">
                        <div className="grid grid-cols-1 gap-2 w-full">
                            {authorDistribution.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="h-3 w-3 rounded-full"
                                            style={{ backgroundColor: `hsl(var(--chart-series-${(index % 5) + 1}))` }}
                                        />
                                        <span className="text-sm">{item.author}</span>
                                    </div>
                                    <span className="text-sm font-medium">{item.count} posts</span>
                                </div>
                            ))}
                        </div>
                    </CardFooter>
                </Card>
            </div>

            {/* Average Believability Card with animated calculation */}
            <Card className="mb-6 mt-8">
                <CardHeader className="pb-8">
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5" />
                        Average Believability
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                        {/* Circular progress indicator for average believability - with animation */}
                        <div className="lg:col-span-2 flex flex-col items-center">
                            <div className="relative flex items-center justify-center w-36 h-36 mb-2">
                                {/* Animated circle background */}
                                <div className="absolute inset-0 rounded-full bg-muted"></div>

                                {/* Animated progress circle */}
                                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r="45%"
                                        strokeWidth="8%"
                                        stroke="currentColor"
                                        fill="none"
                                        className={`transition-all duration-300 ease-out ${
                                            isCalculating ? "text-gray-300" : believabilityColor
                                        }`}
                                        style={{
                                            strokeDasharray: "400",
                                            strokeDashoffset: `${400 - (400 * displayedBelievability) / 100}`,
                                            transition: "stroke-dashoffset 0.3s ease-out, color 0.3s ease-out",
                                        }}
                                    />
                                </svg>

                                {/* Percentage in the middle */}
                                <div className="z-10 flex flex-col items-center justify-center">
                                    <span
                                        className={`text-4xl font-bold transition-colors duration-300 ${
                                            isCalculating ? "text-gray-400" : believabilityColor
                                        }`}
                                    >
                                        {isCalculating && displayedBelievability === 0 ? "..." : displayedBelievability}
                                    </span>
                                    {isCalculating && (
                                        <span className="text-xs text-muted-foreground mt-1">calculating</span>
                                    )}
                                </div>
                            </div>
                            <Badge
                                variant="outline"
                                className={`mt-1 transition-all duration-300 ${
                                    isCalculating
                                        ? "bg-gray-200/10 text-gray-400 border-gray-200/20"
                                        : believabilityBadgeClass
                                }`}
                            >
                                {isCalculating ? "Analyzing content..." : believabilityText}
                            </Badge>
                        </div>

                        {/* Description */}
                        <div className="lg:col-span-3">
                            <h4 className="text-lg font-medium mb-2">Content Trustworthiness Analysis</h4>
                            <p className="text-muted-foreground mb-3">
                                {isCalculating
                                    ? "Analyzing the believability of content across all posts..."
                                    : `The average believability score of ${displayedBelievability} indicates${believabilityDescription}`}
                            </p>
                            <div className="grid grid-cols-3 gap-3 mt-4">
                                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
                                    <span className="text-lg font-bold">
                                        {isCalculating ? "-" : posts.filter((p) => p.confidentialityScore >= 70).length}
                                    </span>
                                    <span className="text-xs text-muted-foreground">High Trust</span>
                                </div>
                                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
                                    <span className="text-lg font-bold">
                                        {isCalculating
                                            ? "-"
                                            : posts.filter(
                                                  (p) => p.confidentialityScore >= 40 && p.confidentialityScore < 70
                                              ).length}
                                    </span>
                                    <span className="text-xs text-muted-foreground">Medium Trust</span>
                                </div>
                                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
                                    <span className="text-lg font-bold">
                                        {isCalculating ? "-" : posts.filter((p) => p.confidentialityScore < 40).length}
                                    </span>
                                    <span className="text-xs text-muted-foreground">Low Trust</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <h3 className="text-xl font-semibold mb-4">All Posts</h3>
            <div className="grid gap-3 grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3">
                {posts.map((post, index) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}

function PostCard({ post }: { post: Post }) {
    // Calculate believability data for tooltip
    const believabilityText =
        post.confidentialityScore >= 70
            ? "High Trustworthiness"
            : post.confidentialityScore >= 40
            ? "Medium Trustworthiness"
            : "Low Trustworthiness";

    return (
        <Card className="flex flex-col h-full">
            <CardContent className="p-4 flex flex-col h-full gap-3">
                {/* Author info and date */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={post.author.avatar} alt={post.author.name} />
                            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-medium">{post.author.name}</span>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <SocialPlatformIcon platform={post.platform} className="h-3 w-3" />
                                <span>{new Date(post.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Trustworthiness indicator - now in the same row as author info */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex items-center justify-center w-14 h-14">
                            {/* Circle background */}
                            <div className="absolute inset-0 rounded-full bg-muted"></div>

                            {/* Progress circle */}
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                <circle
                                    cx="50%"
                                    cy="50%"
                                    r="45%"
                                    strokeWidth="8%"
                                    stroke="currentColor"
                                    fill="none"
                                    className={`transition-all duration-1000 ease-in-out ${
                                        post.confidentialityScore >= 70
                                            ? "text-green-500"
                                            : post.confidentialityScore >= 40
                                            ? "text-yellow-500"
                                            : "text-red-500"
                                    }`}
                                    style={{
                                        strokeDasharray: "283",
                                        strokeDashoffset: `${283 - (283 * post.confidentialityScore) / 100}`,
                                    }}
                                />
                            </svg>

                            {/* Percentage in the middle */}
                            <div className="z-10 flex flex-col items-center justify-center">
                                <span className="text-lg font-bold">{post.confidentialityScore}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-xs font-medium">Believability</span>
                            <Badge
                                variant="outline"
                                className={`${
                                    post.confidentialityScore >= 70
                                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                                        : post.confidentialityScore >= 40
                                        ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                        : "bg-red-500/10 text-red-500 border-red-500/20"
                                }`}
                            >
                                {believabilityText}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Vertical separator after author info */}
                <Separator className="my-1" />

                {/* Content */}
                <div className="flex-1">
                    <p className="mb-3">{post.content}</p>
                </div>

                {/* Engagement metrics with icons */}
                <div>
                    <Separator className="mb-2" />
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Heart className="h-3.5 w-3.5" />
                            <span>{post.likes.toLocaleString()}</span>
                        </div>
                        <Separator orientation="vertical" className="h-3" />
                        <div className="flex items-center gap-1">
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span>{post.comments.toLocaleString()}</span>
                        </div>
                        <Separator orientation="vertical" className="h-3" />
                        <div className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            <span>{post.views.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Vertical separator before social media embed */}
                <Separator className="my-2" />

                {/* Social media embed */}
                <SocialMediaEmbed
                    url={post.url}
                    platform={post.platform}
                    width={800}
                    height={400}
                    className="flex items-center justify-center"
                    style={{ width: "100%", height: "auto" }}
                />
            </CardContent>
        </Card>
    );
}
