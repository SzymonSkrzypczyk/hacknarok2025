# Task:

Develop a dashboard application to display summaries of posts sourced from selected social media platforms. The dashboard will allow users to view concise summaries, interact with various components, and switch between multiple color themes.

# Requirements:

1. Dashboard Overview:

    - Display summaries generated from social media posts.

    - Provide a user panel with profile information.

    - List the social media portals from which the summaries are generated.

    - Include plugin settings and a logout functionality.

    - Offer a button for switching between different color themes.

2. Color Themes (9 Options):

    - Alfheim (Light Blue): Indigo

    - Asgard (Gray): Zinc

    - Jotunheim (Yellow): Yellow

    - Vanaheim (Purple): Purple

    - Midgard (White): Zinc

    - Svaralfheim (Blue): Indigo

    - Niflheim (Green): Emerald

    - Helheim (Cyan): Cyan

    - Muspelheim (Red): Red

3. Main Panel Components:

-   Each component should display:

    -   The category of posts.

    -   The summary of posts.

    -   The count of posts used to generate the summary.

    -   The most important post.

    -   Links to the original posts.

    -   Each component should also show statistics such as:

    -   Display count distribution.

    -   Distribution of comments and likes.

    -   A pie chart showing the breakdown of post authors.

1. Interactions:

    - Clicking on a summary component expands it to occupy the entire main panel.

    - The expanded view should embed full posts based on the originating platform.

2. Tech Stack:

    - Frontend: Next.js with React.

    - Styling: Tailwind CSS.

    - Components: Use Shadcn components for UI building.

## Additional Context for the AI Agent:

Your implementation should strictly use Shadcn components for all UI elements. Ensure that the dashboard is both responsive and aesthetically aligned with modern design practices. The application must support dynamic theme switching among the nine provided themes, and all components should be interactive with clear visual feedback.

This prompt is intended for detailed implementation guidance, so consider breaking down your approach into modular components and integrating detailed testing along each step.
