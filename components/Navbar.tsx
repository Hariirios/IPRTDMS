import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Menu, X, ChevronDown, Globe } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const location = useLocation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'so', name: 'Somali', flag: '🇸🇴' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
      setIsLangMenuOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    {
      label: 'Our Story',
      dropdown: [
        { path: '/about', label: 'About' },
        { path: '/mission-vision', label: 'Mission & Vision' },
        { path: '/sponsors', label: 'Our Sponsors' },
      ]
    },
    {
      label: 'Our Team',
      dropdown: [
        { path: '/staff', label: 'Our Staff' },
        { path: '/facilitators', label: 'Our Facilitators' },
        { path: '/technicians', label: 'Our Technicians' },
      ]
    },
    { path: '/contact', label: 'Contact Us' },
  ];

  const handleDropdownClick = (e: React.MouseEvent, label: string) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-br from-[#8B5CF6] via-[#3B0764] to-[#1E0A3C] dark:from-[#1E0A3C] dark:via-[#3B0764] dark:to-[#8B5CF6]'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" onClick={() => window.scrollTo(0, 0)}>
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white rounded-lg p-2">
                  <img
                    src="/assets/main_logo.png"
                    alt="IPRT Logo"
                    className="h-10 w-auto cursor-pointer group-hover:scale-105 transition-transform"
                  />
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              item.dropdown ? (
                <div key={item.label} className="relative">
                  <Button
                    variant="ghost"
                    onClick={(e) => handleDropdownClick(e, item.label)}
                    className={`relative px-4 ${
                      isScrolled 
                        ? 'text-gray-700 dark:text-gray-300 hover:text-[#3B0764] dark:hover:text-[#8B5CF6]' 
                        : 'text-white hover:text-white/80'
                    }`}
                  >
                    {item.label}
                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                  </Button>
                  
                  <AnimatePresence>
                    {openDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                      >
                        {item.dropdown.map((subItem, index) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            onClick={() => {
                              setOpenDropdown(null);
                              window.scrollTo(0, 0);
                            }}
                            className="block px-4 py-3 hover:bg-[#8B5CF6]/10 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 hover:text-[#3B0764] dark:hover:text-[#8B5CF6]"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link key={item.path} to={item.path} onClick={() => window.scrollTo(0, 0)}>
                  <Button
                    variant="ghost"
                    className={`relative px-4 ${
                      location.pathname === item.path
                        ? isScrolled 
                          ? 'text-[#3B0764] dark:text-[#8B5CF6] font-semibold' 
                          : 'text-white font-semibold'
                        : isScrolled 
                          ? 'text-gray-700 dark:text-gray-300 hover:text-[#3B0764] dark:hover:text-[#8B5CF6]' 
                          : 'text-white/90 hover:text-white'
                    }`}
                  >
                    {item.label}
                    {location.pathname === item.path && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                          isScrolled ? 'bg-[#3B0764] dark:bg-[#8B5CF6]' : 'bg-white'
                        }`}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Button>
                </Link>
              )
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Login Button - Desktop */}
            <Link to="/admin" className="hidden lg:block">
              <Button
                className={`${
                  isScrolled
                    ? 'bg-[#3B0764] text-white hover:bg-[#2d0550]'
                    : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                }`}
              >
                Login
              </Button>
            </Link>

            {/* Language Selector */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLangMenuOpen(!isLangMenuOpen);
                }}
                className={!isScrolled ? 'text-white hover:text-white hover:bg-white/10' : ''}
                title="Change Language"
              >
                <Globe className="h-5 w-5" />
              </Button>

              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as 'en' | 'so' | 'ar');
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-[#8B5CF6]/10 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                          language === lang.code
                            ? 'bg-[#8B5CF6]/20 dark:bg-[#3B0764] text-[#3B0764] dark:text-white font-semibold'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <span>{lang.name}</span>
                        {language === lang.code && (
                          <span className="ml-auto text-[#3B0764] dark:text-[#8B5CF6]">✓</span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              className={!isScrolled ? 'text-white hover:text-white hover:bg-white/10' : ''}
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={`lg:hidden ${!isScrolled ? 'text-white hover:text-white hover:bg-white/10' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item, index) => (
                item.dropdown ? (
                  <div key={item.label}>
                    <div className="px-4 py-2 font-semibold text-gray-900 dark:text-white">
                      {item.label}
                    </div>
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          window.scrollTo(0, 0);
                        }}
                        className={`block px-8 py-2 rounded-lg transition-colors ${
                          location.pathname === subItem.path
                            ? 'bg-[#8B5CF6]/20 dark:bg-[#3B0764] text-[#3B0764] dark:text-white'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        window.scrollTo(0, 0);
                      }}
                      className={`block px-4 py-3 rounded-lg transition-colors ${
                        location.pathname === item.path
                          ? 'bg-[#8B5CF6]/20 dark:bg-[#3B0764] text-[#3B0764] dark:text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                )
              ))}
              
              {/* Login Button - Mobile */}
              <Link
                to="/admin"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
                className="block"
              >
                <Button className="w-full bg-[#3B0764] text-white hover:bg-[#2d0550]">
                  Login
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
