# 🎬 Movie Discovery App

This is my **first React project**, a simple movie discovery app that lets users search for movies and view their details using the TMDb API.

🔗 **Live Demo**: [movie-discovery-app.netlify.app](https://movie-discovery-app.netlify.app)

## 🚀 Features
- 🔍 Search for movies
- 🎞️ View posters and overviews
- ⚡ Fast and responsive UI
- 🌐 Data fetched from [TMDb API](https://www.themoviedb.org/documentation/api)

## 🛠️ Built With
- React
- Vite
- TMDb API
- Appwrite (for tracking search counts)

## 📦 Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/hassan00-0/movie-discovery-app.git
   cd movie-discovery-app
   
2.Install dependencies:
npm install

3.Create a .env file and add your API key:
VITE_TMDB_API_KEY=your_tmdb_api_key_here

4.Run the app:
npm run dev

### 📁 Folder Structure

```
.
├── public
│   ├── hero-bg.png
│   ├── hero-img.png
│   ├── logo.png
│   ├── No-Poster.png
│   ├── Rating.svg
│   └── search.svg
├── src
│   ├── assets
│   │   └── react.svg
│   ├── components
│   │   ├── AuthModal.jsx
│   │   ├── Loader.jsx
│   │   ├── MovieCard.jsx
│   │   └── Search.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── appwrite.js
│   └── index.css
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── main.jsx
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

⚠️ Notes
.env is ignored in version control to keep your API key safe.

This project uses Vite for a lightning-fast development environment.

Made by Hassan
