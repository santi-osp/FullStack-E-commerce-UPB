import { Outlet } from 'react-router-dom'
import Header from '../organisms/Header.jsx'
import Footer from '../organisms/Footer.jsx'

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
