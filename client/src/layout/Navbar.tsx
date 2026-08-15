import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { InstagramIcon } from '../components/icons';
import { useAuth } from '../features/auth/AuthContext';

function BrandMark() {
  return (
    <Link to="/" className="group flex items-baseline gap-2">
      <span className="display-heading text-xl leading-none text-ink sm:text-2xl">
        THE POINT<span className="text-red-500">.</span>ONE
      </span>
      <span className="hidden text-[10px] font-semibold uppercase tracking-[0.3em] text-ink-muted sm:block">
        Club
      </span>
    </Link>
  );
}

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm font-semibold uppercase tracking-wider transition-colors ${
      isActive ? 'text-green-700' : 'text-ink-muted hover:text-ink'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="container-site flex h-16 items-center justify-between">
        <BrandMark />

        <nav className="flex items-center gap-1">
          <NavLink to="/#events" className={navLinkClass}>
            Events
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}
          <a
            href="https://www.instagram.com/thepoint.oneclub"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="The Point One Club on Instagram"
            className="flex h-10 w-10 items-center justify-center rounded-sm text-ink-muted transition-colors hover:text-ink"
          >
            <InstagramIcon />
          </a>
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Log out
            </Button>
          ) : (
            <NavLink to="/login">
              <Button variant="outline" size="sm">
                Admin login
              </Button>
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
