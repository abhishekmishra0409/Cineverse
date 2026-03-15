import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/Signup'
import MovieDetail from './pages/MovieDetail'
import Movies from './pages/Movies'
import AuthGuard from './components/AuthGuard'
import Profile from './pages/Profile'
import SearchPage from './pages/SearchResults'
import TVSeries from './pages/TVSeries'
import TvDetail from './pages/TvDetail'
import PageNotFound from './pages/PageNotFound'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from './pages/Footer'

function App() {

  return (
    <>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Navbar />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"  // or "light"
        />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/' element={<AuthGuard />}>
            <Route path='profile' element={<Profile />} />
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/movies' element={<Movies />} />
          <Route path='/movie/:id' element={<MovieDetail />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path="/tv-shows" element={<TVSeries />} />
          <Route path="/tv/:id" element={<TvDetail />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
