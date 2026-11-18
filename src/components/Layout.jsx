import { Outlet } from 'react-router-dom';
import Nav from './Nav.jsx';

export default function Layout() {
  return (
    <div className="page">
      <Nav />
      <main className="page__main">
        <Outlet />
      </main>
      <footer className="footer">
        <span className="caption">© 2026 이다연 · Built with AWS</span>
      </footer>
    </div>
  );
}
