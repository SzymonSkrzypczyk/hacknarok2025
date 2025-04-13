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
} from "recharts";
import { ArrowLeft, ExternalLink, Users } from "lucide-react";
import { SummaryComponent, Post } from "@/contexts/DataContext";
import { SocialPlatformIcon } from "@/components/SocialPlatformIcon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

interface ExpandedSummaryProps {
    summary: SummaryComponent;
    onCollapse: () => void;
}

export function ExpandedSummary({ summary, onCollapse }: ExpandedSummaryProps) {
    const { category, summary: summaryText, posts, authorDistribution } = summary;
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [themeUpdateKey, setThemeUpdateKey] = useState(0);

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

    // Calculate total posts
    const totalPosts = useMemo(() => {
        return authorDistribution.reduce((acc, curr) => acc + curr.count, 0);
    }, [authorDistribution]);

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

            <h3 className="text-xl font-semibold mt-8 mb-4">All Posts</h3>
            <div className="space-y-4">
                {posts.map((post, index) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}

function PostCard({ post }: { post: Post }) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">{post.author.name}</span>
                            <SocialPlatformIcon platform={post.platform} className="h-4 w-4" />
                            <span className="text-xs text-muted-foreground">
                                {new Date(post.date).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="mt-1">{post.content}</p>
                        <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{post.likes.toLocaleString()} likes</span>
                            <Separator orientation="vertical" className="h-4" />
                            <span>{post.comments.toLocaleString()} comments</span>
                            <Separator orientation="vertical" className="h-4" />
                            <span>{post.views.toLocaleString()} views</span>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                        <a href={post.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
