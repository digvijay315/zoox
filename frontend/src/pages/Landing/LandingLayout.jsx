import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, MapPin, Phone, Mail } from 'lucide-react';
import './landing.css';

const navItems = [
  { to: "/", label: "Home" },
  { to: "/features", label: "Features" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/login", label: "Log in" },
];

function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "surface-ink border-b border-border/20 py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link to="/" className="group flex flex-col leading-none items-start">
          <img src="/logo.png" alt="Zoox" className="h-8 w-auto object-contain" />
          <span className="mt-1 text-[0.55rem] uppercase tracking-luxe text-gold-soft/80">
            A unit of The Grand Portico
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {navItems.slice(0, 4).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => 
                `text-[0.7rem] uppercase tracking-[0.22em] transition-colors hover:text-gold ${
                  isActive ? "text-gold" : "text-ink-foreground/75"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/login"
            className="border border-gold/60 px-6 py-2.5 text-[0.7rem] uppercase tracking-[0.22em] text-gold transition-colors hover:bg-gold hover:text-ink"
          >
            Log in
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="text-ink-foreground md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="surface-ink mt-3 border-t border-border/20 md:hidden">
          <div className="flex flex-col px-6 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) => 
                  `border-b border-border/10 py-3.5 text-[0.72rem] uppercase tracking-[0.22em] ${
                    isActive ? "text-gold" : "text-ink-foreground/80"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="surface-ink">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-4 lg:px-10">
        <div className="lg:col-span-2">
          <img src="/logo.png" alt="Zoox" className="h-10 w-auto object-contain" />
          <p className="mt-2 text-[0.6rem] uppercase tracking-luxe text-gold-soft/80">
            A unit of The Grand Portico
          </p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-foreground/70">
            A refined stay on the Dumka–Rampurhat road, where quiet Jharkhand
            landscapes meet considered hospitality, thoughtful dining and
            occasions worth remembering.
          </p>
        </div>

        <div>
          <p className="eyebrow">Explore</p>
          <div className="mt-5 flex flex-col gap-3 text-sm text-ink-foreground/70">
            <Link to="/" className="hover:text-gold">
              Home
            </Link>
            <Link to="/features" className="hover:text-gold">
              Features
            </Link>
            <Link to="/about" className="hover:text-gold">
              About
            </Link>
            <Link to="/contact" className="hover:text-gold">
              Contact
            </Link>
            <Link to="/login" className="hover:text-gold">
              Log in
            </Link>
          </div>
        </div>

        <div>
          <p className="eyebrow">Reach us</p>
          <div className="mt-5 flex flex-col gap-4 text-sm text-ink-foreground/70">
            <p className="flex gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
              <span>
                Plot No. 316, Rampur, Dumka Rampurhat Road, Dumka – 814119,
                Jharkhand
              </span>
            </p>
            <a href="tel:+916299382018" className="flex gap-3 hover:text-gold">
              <Phone size={16} className="mt-0.5 shrink-0 text-gold" />
              +91 62993 82018
            </a>
            <a
              href="mailto:info@grandportico.in"
              className="flex gap-3 hover:text-gold"
            >
              <Mail size={16} className="mt-0.5 shrink-0 text-gold" />
              info@grandportico.in
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/15">
        <div className="mx-auto max-w-7xl px-6 py-6 text-[0.65rem] uppercase tracking-[0.2em] text-ink-foreground/50 lg:px-10">
          © {new Date().getFullYear()} Zoox · The Grand Portico
        </div>
      </div>
    </footer>
  );
}

const LandingLayout = ({ children }) => {
  return (
    <div className="landing-scope min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow">
        {React.cloneElement(children, { onOpenRegister: () => {} })}
      </main>
      <SiteFooter />
    </div>
  );
};

export default LandingLayout;
