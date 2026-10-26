import { NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar__nav" aria-label="Navigation administrateur">
        <NavLink to="/admin/arrets">Gestion des arrêts</NavLink>
        <NavLink to="/admin/bus">Gestion des bus</NavLink>
        <NavLink to="/admin/chauffeurs">Gestion des chauffeurs</NavLink>
        <NavLink to="/admin/lignes">Gestion des lignes</NavLink>
        <NavLink to="/admin/stagiaires">Gestion des Stagiaires</NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar
