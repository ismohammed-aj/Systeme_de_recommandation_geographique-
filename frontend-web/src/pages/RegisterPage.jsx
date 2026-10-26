import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/authApi'
import { useInputFeedback } from '../hooks/useInputFeedback'

const emptyForm = {
  nom: '',
  prenom: '',
  email: '',
  motDePasse: '',
  confirmPassword: '',
}

const getErrorMessage = (requestError) => {
  const responseData = requestError?.response?.data

  if (responseData?.errors) {
    return Object.values(responseData.errors).join(' ')
  }

  if (responseData?.message) {
    return responseData.message
  }

  if (requestError?.request) {
    return 'Impossible de contacter le serveur. Vérifiez votre connexion internet ou réessayez plus tard.'
  }

  return 'Impossible de creer le compte. Reessayez plus tard.'
}

function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(emptyForm)
  const [passwordVisibility, setPasswordVisibility] = useState({
    confirmPassword: false,
    motDePasse: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { inputFeedback, updateInputFeedback } = useInputFeedback(emptyForm)

  const togglePasswordVisibility = (name) => {
    setPasswordVisibility((currentVisibility) => ({
      ...currentVisibility,
      [name]: !currentVisibility[name],
    }))
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    updateInputFeedback(name, value)
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (formData.motDePasse !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      await register({
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        email: formData.email.trim(),
        motDePasse: formData.motDePasse,
      })

      setSuccess('Compte cree avec succes. Redirection vers la connexion...')
      window.setTimeout(() => navigate('/login', { replace: true }), 1200)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card register-card">
        <img className="auth-logo" src="/ocp-logo.png" alt="OCP" />
        <span className="eyebrow">Nouveau compte</span>
        <h1>Creer un compte stagiaire</h1>
        <p>Votre role sera cree automatiquement en tant que stagiaire.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              Nom
              <input
                autoComplete="family-name"
                className={inputFeedback.nom || ''}
                name="nom"
                onChange={handleChange}
                required
                type="text"
                value={formData.nom}
              />
            </label>

            <label>
              Prenom
              <input
                autoComplete="given-name"
                className={inputFeedback.prenom || ''}
                name="prenom"
                onChange={handleChange}
                required
                type="text"
                value={formData.prenom}
              />
            </label>
          </div>

          <label>
            Email
            <input
              autoComplete="email"
              className={inputFeedback.email || ''}
              name="email"
              onChange={handleChange}
              required
              type="email"
              value={formData.email}
            />
          </label>

          <label>
            Mot de passe
            <div className="password-input-wrapper">
              <input
                autoComplete="new-password"
                className={inputFeedback.motDePasse || ''}
                name="motDePasse"
                onChange={handleChange}
                required
                type={passwordVisibility.motDePasse ? 'text' : 'password'}
                value={formData.motDePasse}
              />
              <button
                aria-label={passwordVisibility.motDePasse ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                aria-pressed={passwordVisibility.motDePasse}
                className="password-visibility-button"
                onClick={() => togglePasswordVisibility('motDePasse')}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className={`eye-icon ${passwordVisibility.motDePasse ? 'eye-icon--visible' : 'eye-icon--hidden'}`}
                />
              </button>
            </div>
          </label>

          <label>
            Confirmer le mot de passe
            <div className="password-input-wrapper">
              <input
                autoComplete="new-password"
                className={inputFeedback.confirmPassword || ''}
                name="confirmPassword"
                onChange={handleChange}
                required
                type={passwordVisibility.confirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
              />
              <button
                aria-label={passwordVisibility.confirmPassword ? 'Masquer la confirmation du mot de passe' : 'Afficher la confirmation du mot de passe'}
                aria-pressed={passwordVisibility.confirmPassword}
                className="password-visibility-button"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className={`eye-icon ${passwordVisibility.confirmPassword ? 'eye-icon--visible' : 'eye-icon--hidden'}`}
                />
              </button>
            </div>
          </label>

          {error && (
            <div className="status-card status-card--error" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="status-card status-card--success" role="status">
              <span className="success-pulse" aria-hidden="true" />
              {success}
            </div>
          )}

          <button
            className="button button--primary"
            disabled={isSubmitting || Boolean(success)}
            type="submit"
          >
            {isSubmitting ? 'Creation...' : 'Creer mon compte'}
          </button>
        </form>

        <Link className="auth-link" to="/login">
          J ai deja un compte
        </Link>
      </div>
    </section>
  )
}

export default RegisterPage
