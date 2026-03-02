import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();

    return (
        <nav className="navbar">
            <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
                Scanner
            </Link>
            <Link
                to="/archive"
                className={`nav-link ${location.pathname === '/archive' ? 'active' : ''}`}
            >
                Archive
            </Link>
        </nav>
    );
}
