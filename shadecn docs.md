Vite
Install and configure shadcn/ui for Vite.

Note: The following guide is for Tailwind v4. If you are using Tailwind v3, use shadcn@2.3.0.

Create project
Start by creating a new React project using vite. Select the React + TypeScript template:

pnpm
npm
yarn
bun
yarn create vite@latest
Copy
Add Tailwind CSS
pnpm
npm
yarn
bun
yarn add tailwindcss @tailwindcss/vite
Copy
Replace everything in src/index.css with the following:

src/index.css
@import "tailwindcss";
Copy
Edit tsconfig.json file
The current version of Vite splits TypeScript configuration into three files, two of which need to be edited. Add the baseUrl and paths properties to the compilerOptions section of the tsconfig.json and tsconfig.app.json files:

{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
Copy
Edit tsconfig.app.json file
Add the following code to the tsconfig.app.json file to resolve paths, for your IDE:

{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
    // ...
  }
}
Copy
Update vite.config.ts
Add the following code to the vite.config.ts so your app can resolve paths without error:

pnpm
npm
yarn
bun
yarn add -D @types/node
Copy
vite.config.ts
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
 
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
Copy
Run the CLI
Run the shadcn init command to setup your project:

pnpm
npm
yarn
bun
npx shadcn@latest init
Copy
You will be asked a few questions to configure components.json.

Which color would you like to use as base color? › Neutral
Copy
Add Components
You can now start adding components to your project.

pnpm
npm
yarn
bun
npx shadcn@latest add button
Copy
The command above will add the Button component to your project. You can then import it like this:

src/App.tsx
import { Button } from "@/components/ui/button"
 
function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <Button>Click me</Button>
    </div>
  )
}
 
export default App

components.json
Configuration for your project.

The components.json file holds configuration for your project.

We use it to understand how your project is set up and how to generate components customized for your project.

Note: The components.json file is optional and only required if you're using the CLI to add components to your project. If you're using the copy and paste method, you don't need this file.

You can create a components.json file in your project by running the following command:

pnpm
npm
yarn
bun
npx shadcn@latest init
Copy
See the CLI section for more information.

$schema
You can see the JSON Schema for components.json here.

components.json
{
  "$schema": "https://ui.shadcn.com/schema.json"
}
Copy
style
The style for your components. This cannot be changed after initialization.

components.json
{
  "style": "new-york"
}
Copy
The default style has been deprecated. Use the new-york style instead.

tailwind
Configuration to help the CLI understand how Tailwind CSS is set up in your project.

See the installation section for how to set up Tailwind CSS.

tailwind.config
Path to where your tailwind.config.js file is located. For Tailwind CSS v4, leave this blank.

components.json
{
  "tailwind": {
    "config": "tailwind.config.js" | "tailwind.config.ts"
  }
}
Copy
tailwind.css
Path to the CSS file that imports Tailwind CSS into your project.

components.json
{
  "tailwind": {
    "css": "styles/global.css"
  }
}
Copy
tailwind.baseColor
This is used to generate the default color palette for your components. This cannot be changed after initialization.

components.json
{
  "tailwind": {
    "baseColor": "gray" | "neutral" | "slate" | "stone" | "zinc"
  }
}
Copy
tailwind.cssVariables
You can choose between using CSS variables or Tailwind CSS utility classes for theming.

To use utility classes for theming set tailwind.cssVariables to false. For CSS variables, set tailwind.cssVariables to true.

components.json
{
  "tailwind": {
    "cssVariables": `true` | `false`
  }
}
Copy
For more information, see the theming docs.

This cannot be changed after initialization. To switch between CSS variables and utility classes, you'll have to delete and re-install your components.

tailwind.prefix
The prefix to use for your Tailwind CSS utility classes. Components will be added with this prefix.

components.json
{
  "tailwind": {
    "prefix": "tw-"
  }
}
Copy
rsc
Whether or not to enable support for React Server Components.

The CLI automatically adds a use client directive to client components when set to true.

components.json
{
  "rsc": `true` | `false`
}
Copy
tsx
Choose between TypeScript or JavaScript components.

Setting this option to false allows components to be added as JavaScript with the .jsx file extension.

components.json
{
  "tsx": `true` | `false`
}
Copy
aliases
The CLI uses these values and the paths config from your tsconfig.json or jsconfig.json file to place generated components in the correct location.

Path aliases have to be set up in your tsconfig.json or jsconfig.json file.

Important: If you're using the src directory, make sure it is included under paths in your tsconfig.json or jsconfig.json file.

aliases.utils
Import alias for your utility functions.

components.json
{
  "aliases": {
    "utils": "@/lib/utils"
  }
}
Copy
aliases.components
Import alias for your components.

components.json
{
  "aliases": {
    "components": "@/components"
  }
}
Copy
aliases.ui
Import alias for ui components.

The CLI will use the aliases.ui value to determine where to place your ui components. Use this config if you want to customize the installation directory for your ui components.

components.json
{
  "aliases": {
    "ui": "@/app/ui"
  }
}
Copy
aliases.lib
Import alias for lib functions such as format-date or generate-id.

components.json
{
  "aliases": {
    "lib": "@/lib"
  }
}
Copy
aliases.hooks
Import alias for hooks such as use-media-query or use-toast.

components.json
{
  "aliases": {
    "hooks": "@/hooks"
  }
}