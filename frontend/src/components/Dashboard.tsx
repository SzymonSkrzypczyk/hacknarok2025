import React from "react";
import { useData } from "@/contexts/DataContext";
import { SummaryCard } from "@/components/SummaryCard";
import { ExpandedSummary } from "@/components/ExpandedSummary";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function Dashboard() {
    const { filteredSummaries, toggleExpand, expandedSummary, filteredPlatform } = useData();

    return (
        <div className="container p-4 md:p-6 lg:p-8 max-w-full">
            {expandedSummary ? (
                <ExpandedSummary summary={expandedSummary} onCollapse={() => toggleExpand(expandedSummary.id)} />
            ) : (
                <>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
                            <p className="text-muted-foreground">
                                {filteredPlatform
                                    ? `Viewing summaries from ${filteredPlatform}`
                                    : "View and analyze your social media posts"}
                            </p>
                        </div>
                    </div>

                    {filteredSummaries.length === 0 ? (
                        <Alert variant="default" className="my-8">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>No summaries found</AlertTitle>
                            <AlertDescription>
                                No summaries were found for {filteredPlatform}. Try selecting a different platform or
                                clear the filter.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                            {filteredSummaries.map((summary) => (
                                <SummaryCard
                                    key={summary.id}
                                    summary={summary}
                                    onExpand={() => toggleExpand(summary.id)}
                                    className="animate-scale-in"
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
