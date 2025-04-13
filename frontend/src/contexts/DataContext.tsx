import React, { createContext, useState, useContext, useEffect } from "react";

// Types
export type SocialPlatform = "twitter" | "facebook" | "instagram" | "linkedin";

export interface Author {
    id: string;
    name: string;
    avatar: string;
    platform: SocialPlatform;
}

export interface Post {
    id: string;
    content: string;
    author: Author;
    platform: SocialPlatform;
    likes: number;
    comments: number;
    views: number;
    date: string;
    url: string;
    confidentialityScore: number; // Score from 0-100
    truthy: boolean; // Boolean indicating if the post is truthful
}

export interface SummaryComponent {
    id: string;
    category: string;
    summary: string;
    posts: Post[];
    importantPost: Post;
    authorDistribution: { author: string; count: number }[];
    isExpanded: boolean;
}

// Temporary JSON database
export interface PostDatabase {
    posts: Post[];
    summaries: SummaryComponent[];
    authors: Author[];
}

// Initialize the database with mock data
export const temporaryDatabase: PostDatabase = {
    authors: [
        {
            id: "a1",
            name: "Jane Smith",
            avatar: "frontend/public/ragnar.png",
            platform: "twitter",
        },
        {
            id: "a2",
            name: "John Doe",

            avatar: "frontend/public/ragnar.png",
            platform: "facebook",
        },
        {
            id: "a3",
            name: "Alex Johnson",

            avatar: "frontend/public/ragnar.png",
            platform: "instagram",
        },
        {
            id: "a4",
            name: "Sam Wilson",

            avatar: "frontend/public/ragnar.png",
            platform: "linkedin",
        },
    ],
    posts: [],
    summaries: [],
};

// Mock data
const mockAuthors: Author[] = temporaryDatabase.authors;

// Helper function to save database to localStorage
export const saveDatabase = () => {
    try {
        localStorage.setItem("postDatabase", JSON.stringify(temporaryDatabase));
        console.log("Database saved to localStorage");
    } catch (error) {
        console.error("Failed to save database to localStorage:", error);
    }
};

// Helper function to load database from localStorage
export const loadDatabase = (): PostDatabase | null => {
    try {
        const data = localStorage.getItem("postDatabase");
        if (data) {
            const parsedData = JSON.parse(data) as PostDatabase;
            // Update the in-memory database
            temporaryDatabase.posts = parsedData.posts;
            temporaryDatabase.summaries = parsedData.summaries;
            temporaryDatabase.authors = parsedData.authors;
            console.log("Database loaded from localStorage");
            return parsedData;
        }
    } catch (error) {
        console.error("Failed to load database from localStorage:", error);
    }
    return null;
};

// Helper function to add a post to the database
export const addPost = (post: Post) => {
    temporaryDatabase.posts.push(post);
    saveDatabase();
};

// Helper function to add a summary to the database
export const addSummary = (summary: SummaryComponent) => {
    temporaryDatabase.summaries.push(summary);
    saveDatabase();
};

const createMockPost = (id: string, authorId: string, platform: SocialPlatform): Post => {
    const author = mockAuthors.find((a) => a.id === authorId) || mockAuthors[0];
    const pc = Math.floor(Math.random() * 101);
    const post = {
        id,
        content: `This is a sample post content from ${platform}. It contains important information about the topic at hand.`,
        author,
        platform: author.platform,
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100),
        views: Math.floor(Math.random() * 10000),
        date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        url: "https://x.com/interesting_aIl/status/1910535479105061073",
        confidentialityScore: pc, // Random score from 0-100
        truthy: pc > 50, // Random boolean
    };

    // Add to the temporary database
    addPost(post);
    return post;
};

const createMockSummary = (id: string, category: string): SummaryComponent => {
    const posts: Post[] = [];

    // Create 5-15 posts for this summary
    const postCount = Math.floor(Math.random() * 10) + 5;

    for (let i = 0; i < postCount; i++) {
        const authorId = mockAuthors[Math.floor(Math.random() * mockAuthors.length)].id;
        const platform = mockAuthors.find((a) => a.id === authorId)?.platform || "twitter";
        posts.push(createMockPost(`p${id}-${i}`, authorId, platform));
    }

    // Create author distribution data
    const authorCounts: Record<string, number> = {};
    posts.forEach((post) => {
        authorCounts[post.author.name] = (authorCounts[post.author.name] || 0) + 1;
    });

    const authorDistribution = Object.entries(authorCounts).map(([author, count]) => ({
        author,
        count,
    }));

    const summary = {
        id,
        category,
        summary: `This is a summary of posts related to ${category}. The summary contains key insights and trends observed across multiple platforms.`,
        posts,
        importantPost: posts[0],
        authorDistribution,
        isExpanded: false,
    };

    // Add to the temporary database
    addSummary(summary);
    return summary;
};

// Function to create Twitter-only summaries
const createTwitterOnlySummary = (id: string, category: string): SummaryComponent => {
    const posts: Post[] = [];

    // Find Twitter authors
    const twitterAuthors = mockAuthors.filter((author) => author.platform === "twitter");

    // Create 3-8 posts for this summary from Twitter only
    const postCount = Math.floor(Math.random() * 5) + 3;

    for (let i = 0; i < postCount; i++) {
        // Select a random Twitter author
        const authorId = twitterAuthors[Math.floor(Math.random() * twitterAuthors.length)].id;
        posts.push(createMockPost(`twitter-${id}-${i}`, authorId, "twitter"));
    }

    // Create author distribution data
    const authorCounts: Record<string, number> = {};
    posts.forEach((post) => {
        authorCounts[post.author.name] = (authorCounts[post.author.name] || 0) + 1;
    });

    const authorDistribution = Object.entries(authorCounts).map(([author, count]) => ({
        author,
        count,
    }));

    const summary = {
        id,
        category,
        summary: `This is a Twitter-exclusive summary about ${category}. All insights are derived from Twitter discussions.`,
        posts,
        importantPost: posts[0],
        authorDistribution,
        isExpanded: false,
    };

    // Add to the temporary database
    addSummary(summary);
    return summary;
};

// Create initial mock data
let initialSummaries: SummaryComponent[] = [];

// Initialize summaries if the database is empty
if (temporaryDatabase.summaries.length === 0) {
    initialSummaries = [
        createMockSummary("s1", "Technology Trends"),
        createMockSummary("s2", "Business News"),
        createMockSummary("s3", "Entertainment"),
        createMockSummary("s4", "Sports Updates"),
        createMockSummary("s5", "Science & Innovation"),
        createMockSummary("s6", "Health & Wellness"),
        // Add Twitter-only summaries
        createTwitterOnlySummary("t1", "Twitter Breaking News"),
        createTwitterOnlySummary("t2", "Twitter Tech Opinions"),
        createTwitterOnlySummary("t3", "Twitter Political Discourse"),
        createTwitterOnlySummary("t4", "Twitter Market Analysis"),
    ];
} else {
    initialSummaries = temporaryDatabase.summaries;
}

// Context type
type DataContextType = {
    summaries: SummaryComponent[];
    toggleExpand: (id: string) => void;
    expandedSummary: SummaryComponent | null;
    filteredPlatform: SocialPlatform | null;
    setFilteredPlatform: (platform: SocialPlatform | null) => void;
    getAllPlatforms: () => SocialPlatform[];
    filteredSummaries: SummaryComponent[];
    addNewPost: (post: Post) => void;
    addNewSummary: (summary: SummaryComponent) => void;
    getAllPosts: () => Post[];
    database: PostDatabase;
};

// Create context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider component
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [summaries, setSummaries] = useState<SummaryComponent[]>(initialSummaries);
    const [expandedSummary, setExpandedSummary] = useState<SummaryComponent | null>(null);
    const [filteredPlatform, setFilteredPlatform] = useState<SocialPlatform | null>(null);
    const [database, setDatabase] = useState<PostDatabase>(temporaryDatabase);

    // Load data from localStorage on initial mount
    useEffect(() => {
        const loadedData = loadDatabase();
        if (loadedData) {
            setSummaries(loadedData.summaries);
            setDatabase(loadedData);
        }
    }, []);

    const toggleExpand = (id: string) => {
        const updatedSummaries = summaries.map((summary) => {
            if (summary.id === id) {
                const newIsExpanded = !summary.isExpanded;

                // Set expanded summary or clear if collapsing
                if (newIsExpanded) {
                    setExpandedSummary({ ...summary, isExpanded: true });
                } else {
                    setExpandedSummary(null);
                }

                return { ...summary, isExpanded: newIsExpanded };
            }
            // Collapse other summaries
            return { ...summary, isExpanded: false };
        });

        setSummaries(updatedSummaries);
    };

    // Get all unique platforms from summaries
    const getAllPlatforms = (): SocialPlatform[] => {
        const platforms = new Set<SocialPlatform>();
        summaries.forEach((summary) => {
            summary.posts.forEach((post) => {
                platforms.add(post.platform);
            });
        });
        return Array.from(platforms);
    };

    // Add a new post to the database and update state
    const addNewPost = (post: Post) => {
        addPost(post);
        setDatabase({ ...temporaryDatabase });
    };

    // Add a new summary to the database and update state
    const addNewSummary = (summary: SummaryComponent) => {
        addSummary(summary);
        setSummaries([...summaries, summary]);
        setDatabase({ ...temporaryDatabase });
    };

    // Get all posts from the database
    const getAllPosts = (): Post[] => {
        return temporaryDatabase.posts;
    };

    // Filter summaries based on selected platform
    const filteredSummaries = filteredPlatform
        ? summaries.filter((summary) => summary.posts.some((post) => post.platform === filteredPlatform))
        : summaries;

    return (
        <DataContext.Provider
            value={{
                summaries,
                toggleExpand,
                expandedSummary,
                filteredPlatform,
                setFilteredPlatform,
                getAllPlatforms,
                filteredSummaries,
                addNewPost,
                addNewSummary,
                getAllPosts,
                database,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

// Custom hook for using the data context
export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
};
