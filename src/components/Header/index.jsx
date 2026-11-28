import {useNavigate, Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Header = ({history, onLogout}) => {
  const navigate = useNavigate()

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    if (onLogout) {
      onLogout()
    }
    if (history && typeof history.replace === 'function') {
      history.replace('/login')
    }
    navigate('/login', {replace: true})
  }

  return (
    <header className="header-container">
      <div className="header-content">
        <Link to="/" className="header-logo-link">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-assess-logo-img.png"
            alt="website logo"
            className="header-website-logo"
          />
        </Link>
        <button
          type="button"
          className="header-logout-button"
          onClick={onClickLogout}
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default Header
