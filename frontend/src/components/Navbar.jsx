import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = localStorage.getItem("dermai_user");
  const name = localStorage.getItem("dermai_name") || user;

  const handleLogout = () => {
    localStorage.removeItem("dermai_user");
    localStorage.removeItem("dermai_name");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">
              Derm<span className="text-teal-400">AI</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive("/")
                  ? "bg-blue-600/30 text-blue-300 border border-blue-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}>
              Home
            </Link>
            <Link to="/analysis"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive("/analysis")
                  ? "bg-teal-600/30 text-teal-300 border border-teal-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}>
              Analyze
            </Link>
          </div>

          {/* User + logout */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 rounded-lg border border-slate-600/40">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold uppercase">
                    {(name || "U")[0]}
                  </span>
                </div>
                <span className="text-slate-300 text-sm capitalize">{name}</span>
              </div>
            )}
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-sm border border-transparent hover:border-red-500/20">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
