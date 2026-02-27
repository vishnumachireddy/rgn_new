import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Leaf, Sun, Moon, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "About", path: "/about" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close profile dropdown on route change
  useEffect(() => {
    setProfileOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    navigate("/");
    setProfileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-strong shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <motion.div whileHover={{ rotate: 20 }} transition={{ type: "spring" }}>
            <Leaf className="h-7 w-7 text-secondary" />
          </motion.div>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Agro<span className="text-secondary">Smart</span>{" "}
            <span className="text-accent">AI</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          {!isAuthenticated ? (
            <>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group relative font-body text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-secondary transition-all duration-300 ${
                      location.pathname === item.path ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-lg border border-border px-5 py-2 font-body text-sm font-medium text-foreground transition-colors hover:border-secondary/50 hover:text-secondary"
                >
                  Login
                </motion.button>
              </Link>
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="agro-btn-primary rounded-lg px-5 py-2 font-body text-sm font-semibold text-primary-foreground glow-primary"
                >
                  Sign Up
                </motion.button>
              </Link>
            </>
          ) : null}

          {/* Theme toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-foreground hover:border-secondary/50"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun className="h-4 w-4" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Profile icon (only when logged in) */}
          {isAuthenticated && (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/20 text-secondary transition-colors hover:bg-secondary/30"
              >
                <User className="h-5 w-5" />
              </motion.button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-xl glass-strong p-2"
                  >
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <p className="font-display text-sm font-semibold text-foreground">{user?.name}</p>
                      <p className="font-body text-xs text-muted-foreground capitalize">{user?.role} • {user?.id}</p>
                    </div>
                    <button
                      onClick={() => { navigate("/profile"); setProfileOpen(false); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 font-body text-sm text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <User className="h-4 w-4" /> Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 font-body text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="rounded-full border border-border p-2 text-muted-foreground"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </motion.button>
          {isAuthenticated && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/profile")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20 text-secondary"
            >
              <User className="h-4 w-4" />
            </motion.button>
          )}
          {!isAuthenticated && (
            <button className="text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu (only when not logged in) */}
      <AnimatePresence>
        {mobileOpen && !isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-strong md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className="font-body text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/login" onClick={() => setMobileOpen(false)} className="font-body text-sm font-medium text-foreground">
                Login
              </Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)}>
                <button className="agro-btn-primary w-full rounded-lg px-5 py-2 font-body text-sm font-semibold text-primary-foreground">
                  Sign Up
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
