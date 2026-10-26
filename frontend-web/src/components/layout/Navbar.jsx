import { Link, useNavigate } from 'react-router-dom'

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

function Navbar() {
  const navigate = useNavigate()
  const user = getStoredUser()
  const homePath = user ? getHomePathForRole(user.role) : '/login'
  const userDisplayName = [user?.prenom, user?.nom].filter(Boolean).join(' ')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  return (
    <header className="navbar">
      <Link className="navbar__brand" to={homePath}>
        <img src="/ocp-logo.png" alt="OCP" />
        <span>OCP Transport Stagiaires</span>
      </Link>
      <nav className="navbar__links" aria-label="Navigation principale">
        {user?.role === 'ADMIN' && <Link to="/admin">Admin</Link>}
        {user?.role === 'STAGIAIRE' && <Link to="/stagiaire">Stagiaire</Link>}
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Creer un compte</Link>}
        {user && (
          <>
            <div className="navbar__user" aria-label="Utilisateur connecte">
              <strong>{userDisplayName || user.email}</strong>
              <span>
                {user.role} - {user.email}
              </span>
            </div>
            <button className="navbar__logout" onClick={handleLogout} type="button">
              Deconnexion
            </button>
          </>
        )}
      </nav>
    </header>
  )
}

export default Navbar
