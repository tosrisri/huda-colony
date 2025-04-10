import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Info, Image, Newspaper, PenTool as Tool, Phone, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import hclogo from '../assets/images/hc-logo.png';

function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Gallery', href: '/gallery', icon: Image },
    { name: 'News', href: '/news', icon: Newspaper },
    { name: 'Services', href: '/services', icon: Tool },
    { name: 'Contact', href: '/contact', icon: Phone },
  ];

  if (user) {
    navigation.push({ name: 'Admin', href: '/admin', icon: Settings });
  }

  return (
    <nav className="shadow-lg navbar-main backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center h-16">
          <div className="flex">
            <Link to="/" className="hc-logo p-2">
              <img src={hclogo} alt="Logo" className="h-full w-auto" />
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'pcolor'
                      : 'scolor hover:pcolor'
                  } px-3 py-2 rounded-md text-sm flex items-center`}
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="scolor hover:pcolor"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'bg-indigo-50 pcolor'
                      : 'text-gray-600 hover:bg-indigo-50 hover:pcolor'
                  } px-3 py-2 rounded-md text-base font-medium flex items-center`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;