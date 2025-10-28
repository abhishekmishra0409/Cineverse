# 🎬 Movie Management App(CineVerse)

A responsive and modern web application built with **React** that allows users to explore trending movies and TV shows, view detailed information, search titles, and manage authentication-protected profiles.
The app integrates with **The Movie Database (TMDB) API** and includes sorting, filtering, and pagination features.

---

## 🚀 Features

✅ Browse trending and popular movies
✅ View detailed movie and TV show information
✅ Search movies and TV shows by title
✅ Filter and sort movies by year or rating
✅ Explore TV series and individual show details
✅ Secure authentication system (Login / Signup)
✅ User profile protected with `AuthGuard`
✅ Pagination support for large datasets
✅ Toast notifications with **React Toastify**
✅ 404 Page (PageNotFound) handling
✅ Fully responsive UI with a dark/light-friendly design

---

## 🧠 Tech Stack

**Frontend:**

* React 18+
* React Router v7
* Redux Toolkit
* Axios
* React Toastify
* Tailwind CSS (or your preferred CSS setup)

**API:**

* [TMDB API](https://developer.themoviedb.org/) — for movie and TV data

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── AuthGuard.jsx
│   ├── Sidebar.jsx
│   ├── MovieCard.jsx
│   ├── Loading.jsx
│   └── ...
│
├── features/
│   └── Movies/
│       ├── movieSlice.js
│       └── ...
│
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Profile.jsx
│   ├── Movies.jsx
│   ├── MovieDetail.jsx
│   ├── TVSeries.jsx
│   ├── TvDetail.jsx
│   ├── SearchResults.jsx
│   └── PageNotFound.jsx
│
├── App.jsx
├── App.css
└── main.jsx
```

---

## ⚙️ Installation and Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/abmishra-1119/MERN-Learning/tree/main/React/Movie_Management
   cd movie-explorer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create an environment file**
   Create a `.env` file in the project root and add your TMDB API key:

   ```
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**
   Visit 👉 [http://localhost:5173](http://localhost:5173)

---

## 🧩 App Flow (Routing Overview)

| Path         | Component    | Description                        |
| ------------ | ------------ | ---------------------------------- |
| `/`          | Home         | Displays trending movies           |
| `/login`     | Login        | User login page                    |
| `/signup`    | SignUp       | User registration page             |
| `/profile`   | Profile      | Protected route using `AuthGuard`  |
| `/movies`    | Movies       | Discover, sort, and filter movies  |
| `/movie/:id` | MovieDetail  | Detailed movie info                |
| `/search`    | SearchPage   | Search results for movies/TV shows |
| `/tv-shows`  | TVSeries     | Explore TV shows                   |
| `/tv/:id`    | TvDetail     | Detailed TV show info              |
| `*`          | PageNotFound | Fallback for undefined routes      |

---

## 🔔 Toast Notification Setup

React Toastify is used globally in `App.jsx`:

```jsx
<ToastContainer
  position="top-right"
  autoClose={3000}
  theme="dark"
/>
```

To show a toast anywhere in your app:

```jsx
import { toast } from "react-toastify";

toast.success("Movies loaded successfully!");
toast.error("Failed to fetch data");
```

---

## 🧪 Example API Slice (Redux Toolkit)

```js
export const discoverMovies = createAsyncThunk(
  'movie/discover',
  async (page, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${base_url}discover/movie?${api_key}&page=${page}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

---


## 🧑‍💻 Author

**Abhishek Mishra**

---

