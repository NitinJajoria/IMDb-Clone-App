# IMDb-Clone-App
## Initial Setup
### Create a folder with name IMDb-Clone-App and also create two sub-folders with name src and public resp.
  Create package.json file using code – npm init -y 
    Tailwindcss setup – 
      Install tailwindcss via npm, and create your tailwind.config.js file. – 
      npm install -D tailwindcss
      npx tailwindcss init
Add the paths to all of your template files in your tailwind.config.js file.
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
Add the @tailwind directives for each of Tailwind’s layers to your main CSS file.
@tailwind base;
@tailwind components;
@tailwind utilities;
Run the CLI tool to scan your template files for classes and build your CSS.
npx tailwindcss -i ./src/input.css -o ./public/style.css --watch
link this style.css file with your index.html file
For ease of doing add below code to script section of package.json file and run the cli tool using “npm run dev” 
"dev": "tailwindcss -i ./src/input.css -o ./public/style.css --watch" 
File structure
 
