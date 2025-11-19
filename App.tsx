import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { ScrollToTop } from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Videos from './pages/Videos';
import Testimonials from './pages/Testimonials';
import Partners from './pages/Partners';
import Sponsors from './pages/Sponsors';
import MissionVision from './pages/MissionVision';
import Staff from './pages/Staff';
import Facilitators from './pages/Facilitators';
import Technicians from './pages/Technicians';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import ResetPassword from './pages/ResetPassword';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/mission-vision" element={<MissionVision />} />
                <Route path="/staff" element={<Staff />} />
                <Route path="/facilitators" element={<Facilitators />} />
                <Route path="/technicians" element={<Technicians />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:id" element={<ServiceDetail />} />
                <Route path="/videos" element={<Videos />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/sponsors" element={<Sponsors />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/reset-password" element={<ResetPassword />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <WhatsAppButton />
            <Toaster />
          </div>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
