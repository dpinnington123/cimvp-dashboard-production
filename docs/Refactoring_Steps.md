Okay, I understand the requirements. You want to restructure the "Performance Scores" tab within the ContentReportsPage component to display scores in a three-column layout, focusing on three key categories: "Strategic Alignment", "Execution Effectiveness", and "Format Effectiveness". Each column will feature a main summary card for the category at the top (with a title, average score percentage, and a circular progress indicator) followed by individual cards for each check belonging to that category using the existing ScoreCard component.
Here’s the plan to achieve this:
Data Preparation (Grouping and Averaging):
Inside the ContentReportsPage component, we'll use React.useMemo to process the contentScores data.
We will filter the scores to include only those whose check_sub_category matches one of our three target categories: "Strategic Alignment", "Execution Effectiveness", or "Format Effectiveness". (We'll need to verify these are the exact strings used in your data for check_sub_category).
We'll group the filtered scores based on their check_sub_category.
For each of these three groups, we'll calculate the average score by converting each check's score_value (0-5) to a percentage (0-100) using convertScoreToPercentage and then averaging these percentages.
We will create a data structure to hold the results, mapping each category title to its calculated average score and the list of individual check scores belonging to it.
Layout Adjustment:
We will modify the TabsContent component associated with the value="performance" tab.
The current grid layout (grid grid-cols-1 sm:grid-cols-2 gap-4) will be changed to a three-column layout, likely grid grid-cols-1 md:grid-cols-3 gap-6, to accommodate the three main categories.
Rendering the Columns and Cards:
We will iterate through the three target category names ("Strategic Alignment", "Execution Effectiveness", "Format Effectiveness").
For each category name:
We'll render a container div to represent the column.
Main Category Summary Card: At the top of the column, we'll render a Card component. Inside this card:
Display the category title (e.g., "STRATEGIC ALIGNMENT").
Display the pre-calculated average score percentage for this category.
Include the CircularProgressIndicator component, passing the average score percentage as the value and adjusting size and strokeWidth for appropriate visual prominence compared to the check cards.
Add a brief, relevant description for the category (this might be a static description or potentially derived dynamically if appropriate data exists).
(Note: The horizontal bar with low/average/high markers shown in the image under the main score requires a new component or significant modification to an existing one, and potentially data for the 'average' marker that isn't currently available in the Score type. We will initially omit this bar for the main category card and focus on the circular indicator.)
Individual Check Cards: Below the main summary card, we'll retrieve the list of individual checks (scores) associated with the current category from our prepared data structure. We'll map over this list and render the existing ScoreCard component for each check, passing the necessary props (title, value (as percentage), description).
Styling:
We'll use Tailwind CSS classes throughout to ensure the layout, spacing, font sizes, and visual hierarchy match the intended design as closely as possible with the existing components.
This plan focuses on iterating on the existing structure and components where possible. The main changes involve data processing (grouping/averaging) and layout adjustments, along with rendering a new summary card structure for each category using existing Card and CircularProgressIndicator components. The individual checks will continue to use the current ScoreCard component.