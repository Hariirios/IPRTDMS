import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, User, Mail, Phone, GraduationCap, Briefcase, FileText, Upload, Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { emailService, ProgramApplication } from '../../lib/emailService';

interface ProgramApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  programTitle: string;
  intakeDate: string;
  price?: string;
}

export function ProgramApplicationForm({ 
  isOpen, 
  onClose, 
  programTitle, 
  intakeDate,
  price 
}: ProgramApplicationFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    motivation: ''
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF or Word document');
        return;
      }
      
      setCvFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone || !formData.education || !formData.motivation) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.motivation.length < 50) {
      toast.error('Please provide a more detailed motivation (at least 50 characters)');
      return;
    }

    setIsSubmitting(true);

    try {
      const applicationData: ProgramApplication = {
        ...formData,
        programTitle,
        intakeDate,
        cv: cvFile || undefined
      };

      const success = await emailService.sendProgramApplication(applicationData);

      if (success) {
        toast.success('Application submitted successfully! Admin will review and contact you soon.');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          education: '',
          experience: '',
          motivation: ''
        });
        setCvFile(null);
        onClose();
      } else {
        toast.error('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Application error:', error);
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
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Apply for Program
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

        {/* Program Info */}
        <div className="bg-gradient-to-r from-[#8B5CF6]/10 to-[#3B0764]/10 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            {programTitle}
          </h4>
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>📅 Starts: {intakeDate}</span>
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
            <Label htmlFor="education" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Educational Background *
            </Label>
            <Input
              id="education"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              placeholder="e.g., Bachelor's in Computer Science, High School Diploma"
              required
            />
          </div>

          <div>
            <Label htmlFor="experience" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Relevant Experience (Optional)
            </Label>
            <Input
              id="experience"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              placeholder="Brief description of relevant work or project experience"
            />
          </div>

          <div>
            <Label htmlFor="motivation" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Why do you want to join this program? *
            </Label>
            <textarea
              id="motivation"
              value={formData.motivation}
              onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
              placeholder="Tell us about your goals, motivation, and how this program fits your career plans... (minimum 50 characters)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
              rows={4}
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formData.motivation.length}/50 characters minimum
            </p>
          </div>

          <div>
            <Label htmlFor="cv" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              CV/Resume (Optional)
            </Label>
            <div className="mt-1">
              <input
                id="cv"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-[#8B5CF6] file:text-white hover:file:bg-[#7C3AED]"
              />
              {cvFile && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  ✓ {cvFile.name} selected
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                PDF or Word document, max 5MB
              </p>
            </div>
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
                  Submit Application
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
            📧 Your application will be reviewed by our admin team. You will receive an email with next steps within 2-3 business days.
          </p>
        </div>
      </motion.div>
    </div>
  );
}