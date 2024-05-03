# Louies Catalog
Fast, flexible search to help students explore and discover courses based on whatever topics they want to learn. Try it out: https://louie.davidteju.dev/

## The story
In my fall semester of 2023, I was trying to learn to swim and couldn't find an easy way to search for a swimming course at my university, so I thought to build a course search for my school's courses but I never quite found time. One fateful weekend, I fell ill. My body gets overly dramatic when I'm ill to the point where I can't leave my bed. So instead of groveling in bed and crying, I decided to grovel in bed, while building something (and crying). I had also never quite used Next.js/React so this was a perfect opportunity. Since I had nothing else to do but grovel, cry and code, I was able to complete this in a single weekend :)

## How It Works
1. The application scrapes course data from the university's course catalog website using Cheerio.js.
2. The scraped data is processed (flattened, removed stop words, stemmed descriptions) and stored.
3. The course data is indexed using MiniSearch.
5. When a user enters a search query, the application sends a request to the backend API, which performs the search and returns the relevant course results.

## Getting Started
1. Clone the repository:
   ```
   git clone https://github.com/DavidTeju/louies-catalog.git
   ```
2. Install the dependencies:
   ```
   cd louies-catalog
   npm install
   ```
3. Start the development server:
   ```
   npm run start
   npm run dev
   ```
4. Open your browser and visit `http://localhost:3000` to see the application in action.

## Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.
