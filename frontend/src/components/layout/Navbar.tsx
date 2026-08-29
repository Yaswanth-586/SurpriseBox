import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Gift, Sparkles, LayoutDashboard, LogOut, User } from 'lucide-react';
import { isAuthenticated, removeToken } from '../../utils/auth';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isSurprisePage = location.pathname.startsWith('/s/');
  const [authStatus, setAuthStatus] = useState(false);

  useEffect(() => {
    setAuthStatus(isAuthenticated());
  }, [location.pathname]);

  const handleLogout = () => {
    removeToken();
    setAuthStatus(false);
    navigate('/');
  };

  if (isSurprisePage) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white/80 transition-colors text-sm">
            <Sparkles className="w-4 h-4" />
            <span>SurpriseBox</span>
          </Link>
        </div>
      </nav>
    );
  }

  // Hide nav on login/register pages since they have their own minimalist header
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl hover:text-cyan-300 transition-colors">
          <Sparkles className="w-6 h-6 text-cyan-400" />
          <span>SurpriseBox</span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          {!authStatus ? (
            <Link to="/login" className="text-white/70 hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          ) : (
            <>
              <Link to="/dashboard" className="text-white/70 hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <button onClick={handleLogout} className="text-white/70 hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </>
          )}

          <Link
            to="/create"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full text-sm font-medium transition-all shadow-lg shadow-purple-500/25"
          >
            <Gift className="w-4 h-4" />
            <span className="hidden sm:inline">Create Surprise</span>
            <span className="sm:hidden">Create</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
