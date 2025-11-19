import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, LogOut, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/button';

interface AdminHeaderProps {
    onLogout: () => void;
}

export function AdminHeader({ onLogout }: AdminHeaderProps) {
    const { isDark, toggleTheme } = useTheme();

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-[#3B0764]/20 dark:border-[#8B5CF6]/20"
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo and Welcome */}
                    <div className="flex items-center space-x-3 md:space-x-4">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center"
                        >
                            <img
                                src="/assets/main_logo.png"
                                alt="Sirta Maanka"
                                className="h-10 w-auto sm:h-12 md:h-14 transition-all"
                            />
                        </motion.div>
                        <div className="border-l border-[#3B0764]/30 dark:border-[#8B5CF6]/30 pl-3 md:pl-4">
                            <h1 className="text-sm sm:text-lg md:text-xl font-bold text-[#3B0764] dark:text-[#8B5CF6]">
                                <span className="hidden sm:inline">Welcome to </span>Admin
                            </h1>
                            <p className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">
                                Manage your content
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                        {/* Back to Website */}
                        <Link to="/">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-[#3B0764] text-[#3B0764] hover:bg-[#3B0764] hover:text-white dark:border-[#8B5CF6] dark:text-[#8B5CF6] dark:hover:bg-[#8B5CF6] dark:hover:text-[#3B0764]"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Back to Website</span>
                                <span className="sm:hidden">Back</span>
                            </Button>
                        </Link>

                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="hover:bg-[#3B0764]/10 dark:hover:bg-[#8B5CF6]/10"
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
                                        <Sun className="h-5 w-5 text-[#3B0764] dark:text-[#8B5CF6]" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="moon"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Moon className="h-5 w-5 text-[#3B0764] dark:text-[#8B5CF6]" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>

                        {/* Logout */}
                        <Button
                            onClick={onLogout}
                            size="sm"
                            className="bg-gradient-to-r from-[#3B0764] to-[#3B0764] hover:from-[#3B0764] hover:to-[#3B0764] text-white"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Logout</span>
                        </Button>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
