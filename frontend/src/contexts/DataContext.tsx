
import React, { createContext, useState, useContext } from "react";

// Types
export type SocialPlatform = "twitter" | "facebook" | "instagram" | "linkedin" | "reddit";

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

// Mock data
const mockAuthors: Author[] = [
  {
    id: "a1",
    name: "Jane Smith",
    avatar: "/placeholder.svg",
    platform: "twitter",
  },
  {
    id: "a2",
    name: "John Doe",
    avatar: "/placeholder.svg",
    platform: "facebook",
  },
  {
    id: "a3",
    name: "Alex Johnson",
    avatar: "/placeholder.svg",
    platform: "instagram",
  },
  {
    id: "a4",
    name: "Sam Wilson",
    avatar: "/placeholder.svg",
    platform: "linkedin",
  },
  {
    id: "a5",
    name: "Taylor Swift",
    avatar: "/placeholder.svg",
    platform: "reddit",
  },
];

const createMockPost = (id: string, authorId: string, platform: SocialPlatform): Post => {
  const author = mockAuthors.find(a => a.id === authorId) || mockAuthors[0];
  return {
    id,
    content: `This is a sample post content from ${platform}. It contains important information about the topic at hand.`,
    author,
    platform,
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100),
    views: Math.floor(Math.random() * 10000),
    date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    url: `https://${platform}.com/post/${id}`,
  };
};

const createMockSummary = (id: string, category: string): SummaryComponent => {
  const posts: Post[] = [];
  
  // Create 5-15 posts for this summary
  const postCount = Math.floor(Math.random() * 10) + 5;
  
  for (let i = 0; i < postCount; i++) {
    const authorId = mockAuthors[Math.floor(Math.random() * mockAuthors.length)].id;
    const platform = mockAuthors.find(a => a.id === authorId)?.platform || "twitter";
    posts.push(createMockPost(`p${id}-${i}`, authorId, platform));
  }

  // Create author distribution data
  const authorCounts: Record<string, number> = {};
  posts.forEach(post => {
    authorCounts[post.author.name] = (authorCounts[post.author.name] || 0) + 1;
  });
  
  const authorDistribution = Object.entries(authorCounts).map(([author, count]) => ({ 
    author, 
    count 
  }));

  return {
    id,
    category,
    summary: `This is a summary of posts related to ${category}. The summary contains key insights and trends observed across multiple platforms.`,
    posts,
    importantPost: posts[0],
    authorDistribution,
    isExpanded: false,
  };
};

// Create initial mock data
const initialSummaries: SummaryComponent[] = [
  createMockSummary("s1", "Technology Trends"),
  createMockSummary("s2", "Business News"),
  createMockSummary("s3", "Entertainment"),
  createMockSummary("s4", "Sports Updates"),
  createMockSummary("s5", "Science & Innovation"),
  createMockSummary("s6", "Health & Wellness"),
];

// Context type
type DataContextType = {
  summaries: SummaryComponent[];
  toggleExpand: (id: string) => void;
  expandedSummary: SummaryComponent | null;
  filteredPlatform: SocialPlatform | null;
  setFilteredPlatform: (platform: SocialPlatform | null) => void;
  getAllPlatforms: () => SocialPlatform[];
  filteredSummaries: SummaryComponent[];
};

// Create context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider component
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [summaries, setSummaries] = useState<SummaryComponent[]>(initialSummaries);
  const [expandedSummary, setExpandedSummary] = useState<SummaryComponent | null>(null);
  const [filteredPlatform, setFilteredPlatform] = useState<SocialPlatform | null>(null);

  const toggleExpand = (id: string) => {
    const updatedSummaries = summaries.map(summary => {
      if (summary.id === id) {
        const newIsExpanded = !summary.isExpanded;
        
        // Set expanded summary or clear if collapsing
        if (newIsExpanded) {
          setExpandedSummary({...summary, isExpanded: true});
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
    summaries.forEach(summary => {
      summary.posts.forEach(post => {
        platforms.add(post.platform);
      });
    });
    return Array.from(platforms);
  };

  // Filter summaries based on selected platform
  const filteredSummaries = filteredPlatform 
    ? summaries.filter(summary => 
        summary.posts.some(post => post.platform === filteredPlatform)
      )
    : summaries;

  return (
    <DataContext.Provider value={{ 
      summaries, 
      toggleExpand, 
      expandedSummary, 
      filteredPlatform,
      setFilteredPlatform,
      getAllPlatforms,
      filteredSummaries
    }}>
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
