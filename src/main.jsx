import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, Router, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import MealsPage from './pages/MealsPage.jsx'
import RecipiePage from './pages/RecipiePage.jsx'


const router= createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<LandingPage />}/>
      <Route path='/recipies' element={<MealsPage />}/>
      <Route path='/recipies/:id' element={<RecipiePage />}/>

    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </StrictMode>,
)
