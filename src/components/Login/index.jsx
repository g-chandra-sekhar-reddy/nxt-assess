import {useState} from 'react'
import {useNavigate, Navigate} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Login = ({skipAuthRedirect = false, onLogin}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showSubmitError, setShowSubmitError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const token = Cookies.get('jwt_token')
  if (token !== undefined && !skipAuthRedirect) {
    return <Navigate to="/" replace />
  }

  const onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    if (onLogin) {
      onLogin()
    }
    navigate('/', {replace: true})
  }

  const onSubmitFailure = err => {
    setShowSubmitError(true)
    setErrorMsg(err)
  }

  const onSubmitForm = async event => {
    event.preventDefault()
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok === true) {
        onSubmitSuccess(data.jwt_token)
      } else {
        onSubmitFailure(data.error_msg)
      }
    } catch {
      onSubmitFailure('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-assess-logo-img.png"
            alt="login website logo"
            className="login-website-logo"
          />
        </div>
        <form className="login-form" onSubmit={onSubmitForm}>
          <div className="login-input-group">
            <label className="login-label" htmlFor="username">
              USERNAME
            </label>
            <input
              id="username"
              type="text"
              className="login-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
            />
          </div>

          <div className="login-input-group">
            <label className="login-label" htmlFor="password">
              PASSWORD
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="login-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>

          <div className="login-checkbox-group">
            <input
              id="showPassword"
              type="checkbox"
              className="login-checkbox"
              checked={showPassword}
              onChange={e => setShowPassword(e.target.checked)}
            />
            <label className="login-checkbox-label" htmlFor="showPassword">
              Show Password
            </label>
          </div>

          <button type="submit" className="login-submit-button">
            Login
          </button>

          {showSubmitError && <p className="login-error-msg">{errorMsg}</p>}
        </form>
      </div>
    </div>
  )
}

export default Login
