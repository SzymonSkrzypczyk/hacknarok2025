import React from "react";
import { DataProvider } from "@/contexts/DataContext";
import { AppLayout } from "@/components/AppLayout";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
    return (
        <DataProvider>
            <AppLayout>
                <Dashboard />
            </AppLayout>
        </DataProvider>
    );
};

export default Index;
