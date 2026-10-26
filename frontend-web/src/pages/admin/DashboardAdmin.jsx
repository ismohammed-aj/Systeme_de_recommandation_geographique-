import { Link } from 'react-router-dom'

const adminLinks = [
  {
    description: 'Consulter, ajouter, modifier et supprimer les arrets.',
    label: 'Gestion des arrêts',
    to: '/admin/arrets',
  },
  {
    description: 'Gerer les bus disponibles pour le transport.',
    label: 'Gestion des bus',
    to: '/admin/bus',
  },
  {
    description: 'Gerer les chauffeurs et leurs informations.',
    label: 'Gestion des chauffeurs',
    to: '/admin/chauffeurs',
  },
  {
    description: 'Gerer les lignes et les arrets associes.',
    label: 'Gestion des lignes',
    to: '/admin/lignes',
  },
  {
    description: 'Visualiser les stagiaires ayant partage leur position GPS.',
    label: 'Gestion des Stagiaires',
    to: '/admin/stagiaires',
  },
]

function DashboardAdmin() {
  return (
    <section className="page admin-dashboard-page">
      <div className="page-header">
        <div>
          <h1>Tableau de bord Administrateur</h1>
          <p>Acces rapide aux modules de gestion du transport.</p>
        </div>
        <Link className="text-link" to="/admin/lignes">
          Construire une ligne
        </Link>
      </div>

      <div className="dashboard-grid">
        {adminLinks.map((link) => (
          <Link className="dashboard-link-card" key={link.to} to={link.to}>
            <h2>{link.label}</h2>
            <p>{link.description}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default DashboardAdmin
