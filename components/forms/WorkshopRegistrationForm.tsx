import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, User, Mail, Phone, Award, MessageSquare, Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { emailService, WorkshopRegistration } from '../../lib/emailService';

interface WorkshopRegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  workshopTitle: string;
  workshopDate: string;
  price?: string;
}

export function WorkshopRegistrationForm({ 
  isOpen, 
  onClose, 
  workshopTitle, 
  workshopDate,
  price 
}: WorkshopRegistrationFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    expectations: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const registrationData: WorkshopRegistration = {
        ...formData,
        workshopTitle,
        workshopDate
      };

      const success = await emailService.sendWorkshopRegistration(registrationData);

      if (success) {
        toast.success('Registration submitted successfully! Admin will contact you soon.');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          experience: 'Beginner',
          expectations: ''
        });
        onClose();
      } else {
        toast.error('Failed to submit registration. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Register for Workshop
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Workshop Info */}
        <div className="bg-gradient-to-r from-[#8B5CF6]/10 to-[#3B0764]/10 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            {workshopTitle}
          </h4>
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>📅 {workshopDate}</span>
            {price && <span className="font-semibold text-[#3B0764] dark:text-[#8B5CF6]">{price}</span>}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name *
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email address"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number *
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div>
            <Label htmlFor="experience" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Experience Level *
            </Label>
            <select
              id="experience"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
              required
            >
              <option value="Beginner">Beginner - New to this topic</option>
              <option value="Intermediate">Intermediate - Some experience</option>
              <option value="Advanced">Advanced - Experienced practitioner</option>
            </select>
          </div>

          <div>
            <Label htmlFor="expectations" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              What do you hope to learn? (Optional)
            </Label>
            <textarea
              id="expectations"
              value={formData.expectations}
              onChange={(e) => setFormData({ ...formData, expectations: e.target.value })}
              placeholder="Tell us about your learning goals and expectations..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#3B0764] hover:bg-[#2d0550] disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Submit Registration
                </div>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* Note */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            📧 Your registration will be sent to our admin team. You will receive a confirmation email with payment details shortly.
          </p>
        </div>
      </motion.div>
    </div>
  );
}