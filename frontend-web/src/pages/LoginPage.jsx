import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/authApi'
import { useInputFeedback } from '../hooks/useInputFeedback'

const loginInputFields = {
  email: '',
  password: '',
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

  return 'Impossible de se connecter. Verifiez vos identifiants.'
}

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { inputFeedback, updateInputFeedback } = useInputFeedback(loginInputFields)
  const [cursorGlow, setCursorGlow] = useState({
    active: false,
    x: '50vw',
    y: '50vh',
  })

  const handleCursorMove = (event) => {
    if (event.pointerType !== 'mouse') {
      return
    }

    setCursorGlow({
      active: true,
      x: `${event.clientX}px`,
      y: `${event.clientY}px`,
    })
  }

  const handleCursorLeave = () => {
    setCursorGlow((currentGlow) => ({
      ...currentGlow,
      active: false,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const enteredEmail = email.trim()

    if (!enteredEmail || !password) {
      setError('Email et mot de passe sont obligatoires.')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      const response = await login(enteredEmail, password)
      const { token, role, nom, prenom } = response.data
      const normalizedRole = role?.toUpperCase()

      if (!token || !['ADMIN', 'STAGIAIRE'].includes(normalizedRole)) {
        setError('Reponse de connexion invalide.')
        return
      }

      localStorage.setItem('token', token)
      localStorage.setItem(
        'user',
        JSON.stringify({
          email: response.data.email ?? enteredEmail,
          role: normalizedRole,
          nom: nom ?? '',
          prenom: prenom ?? '',
        }),
      )

      navigate(normalizedRole === 'ADMIN' ? '/admin' : '/stagiaire', {
        replace: true,
      })
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      className="auth-page login-page"
      onPointerLeave={handleCursorLeave}
      onPointerMove={handleCursorMove}
      style={{
        '--cursor-glow-x': cursorGlow.x,
        '--cursor-glow-y': cursorGlow.y,
      }}
    >
      <span
        aria-hidden="true"
        className={`auth-cursor-glow ${cursorGlow.active ? 'is-active' : ''}`}
      />
      <div className="auth-card login-card">
        <img className="auth-logo" src="/ocp-logo.png" alt="OCP" />
        <span className="eyebrow">Connexion securisee</span>
        <h1>OCP Transport Stagiaires</h1>
        <p>Connectez-vous pour acceder a votre espace.</p>

        <form className="auth-form login-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              autoComplete="email"
              className={inputFeedback.email || ''}
              name="email"
              onChange={(event) => {
                const nextValue = event.target.value

                updateInputFeedback('email', nextValue)
                setEmail(nextValue)
                setError('')
              }}
              placeholder="nom@exemple.com"
              type="email"
              value={email}
            />
          </label>

          <label>
            Mot de passe
            <div className="password-input-wrapper">
              <input
                autoComplete="current-password"
                className={inputFeedback.password || ''}
                name="password"
                onChange={(event) => {
                  const nextValue = event.target.value

                  updateInputFeedback('password', nextValue)
                  setPassword(nextValue)
                  setError('')
                }}
                placeholder="Votre mot de passe"
                type={isPasswordVisible ? 'text' : 'password'}
                value={password}
              />
              <button
                aria-label={isPasswordVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                aria-pressed={isPasswordVisible}
                className="password-visibility-button"
                onClick={() => setIsPasswordVisible((currentValue) => !currentValue)}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className={`eye-icon ${isPasswordVisible ? 'eye-icon--visible' : 'eye-icon--hidden'}`}
                />
              </button>
            </div>
          </label>

          {error && (
            <div className="status-card status-card--error" role="alert">
              {error}
            </div>
          )}

          <button
            className="button button--primary"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <Link className="auth-link" to="/register">
          Creer un compte
        </Link>
      </div>
    </section>
  )
}

export default LoginPage
