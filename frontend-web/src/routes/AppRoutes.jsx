import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import DashboardAdmin from '../pages/admin/DashboardAdmin'
import GestionArrets from '../pages/admin/GestionArrets'
import GestionBus from '../pages/admin/GestionBus'
import GestionChauffeurs from '../pages/admin/GestionChauffeurs'
import GestionLignes from '../pages/admin/GestionLignes'
import GestionStagiaires from '../pages/admin/GestionStagiaires'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import DashboardStagiaire from '../pages/stagiaire/DashboardStagiaire'
import RecommendationPage from '../pages/stagiaire/RecommendationPage'

const getStoredUser = () => {
  try {
    const token = localStorage.getItem('token')
    const storedUser = JSON.parse(localStorage.getItem('user'))

    if (
      !token ||
      !storedUser?.email ||
      !['ADMIN', 'STAGIAIRE'].includes(storedUser?.role)
    ) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return null
    }

    return storedUser
  } catch {
    return null
  }
}

const getHomePathForRole = (role) =>
  role === 'ADMIN' ? '/admin' : '/stagiaire'

function ProtectedRoute({ allowedRoles, children }) {
  const user = getStoredUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getHomePathForRole(user.role)} replace />
  }

  return children
}

function AdminLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="app-shell">
        <Sidebar />
        <main className="app-main admin-dashboard-main">{children}</main>
      </div>
    </>
  )
}

function StagiaireLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="app-main stagiaire-main">{children}</main>
    </>
  )
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout>
                <DashboardAdmin />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bus"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout>
                <GestionBus />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/chauffeurs"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout>
                <GestionChauffeurs />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/arrets"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout>
                <GestionArrets />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/lignes"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout>
                <GestionLignes />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stagiaires"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout>
                <GestionStagiaires />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/stagiaire"
          element={
            <ProtectedRoute allowedRoles={['STAGIAIRE']}>
              <StagiaireLayout>
                <DashboardStagiaire />
              </StagiaireLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/stagiaire/recommendation"
          element={
            <ProtectedRoute allowedRoles={['STAGIAIRE']}>
              <StagiaireLayout>
                <RecommendationPage />
              </StagiaireLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
