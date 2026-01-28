import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, Camera, Save, X, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { memberStore, Member } from '../../lib/memberStore';

export function MemberProfile() {
  const [member, setMember] = useState<Member | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    image: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const currentMemberId = localStorage.getItem('currentMemberId');
      
      if (!currentMemberId) {
        toast.error('Member ID not found');
        return;
      }

      const memberData = await memberStore.getById(currentMemberId);
      
      if (memberData) {
        setMember(memberData);
        setFormData({
          name: memberData.name,
          email: memberData.email,
          phone: memberData.phone,
          password: memberData.password,
          image: memberData.image || ''
        });
        setImagePreview(memberData.image || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Import the image utility
      const { handleImageUpload: processImage } = await import('../../lib/imageUtils');
      
      // Show loading toast
      const loadingToast = toast.loading('Optimizing image...');
      
      // Process image with good quality
      const compressedImage = await processImage(file);
      
      setImagePreview(compressedImage);
      setFormData({ ...formData, image: compressedImage });
      
      toast.dismiss(loadingToast);
      toast.success('Profile picture updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
      console.error('Image upload error:', error);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setFormData({ ...formData, image: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!member) return;

    try {
      await memberStore.update(member.id, {
        ...formData,
        assignedProjects: member.assignedProjects
      });

      // Update localStorage email if changed
      if (formData.email !== member.email) {
        localStorage.setItem('currentMemberEmail', formData.email);
      }

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      await loadProfile();
    } catch (error: any) {
      if (error.message?.includes('duplicate') || error.code === '23505') {
        toast.error('Email already exists. Please use a different email.');
      } else {
        toast.error('Failed to update profile');
      }
      console.error(error);
    }
  };

  const handleCancel = () => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        password: member.password,
        image: member.image || ''
      });
      setImagePreview(member.image || '');
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B0764]"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h2>
          <p className="text-gray-600 dark:text-gray-400">View and update your profile information</p>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-[#3B0764] hover:bg-[#2d0550]"
          >
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center space-y-4 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#3B0764]"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#3B0764] to-[#8B5CF6] flex items-center justify-center border-4 border-[#3B0764]">
                  <User className="h-16 w-16 text-white" />
                </div>
              )}
              
              {isEditing && (
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 w-10 h-10 bg-[#3B0764] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#2d0550] transition-colors"
                >
                  <Camera className="h-5 w-5 text-white" />
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {isEditing && imagePreview && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveImage}
                className="text-red-600"
              >
                <X className="h-4 w-4 mr-2" />
                Remove Photo
              </Button>
            )}

            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                member.status === 'Active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              }`}>
                {member.status}
              </span>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={!isEditing}
                  className="pr-10"
                  required
                />
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Additional Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <p className="font-semibold text-gray-900 dark:text-white">{member.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Assigned Projects</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {member.assignedProjects?.length || 0} Projects
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-[#3B0764] hover:bg-[#2d0550]"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          )}
        </form>
      </motion.div>

      {/* Tips Section */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Tips</h4>
          <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
            <li>• Profile picture should be less than 2MB</li>
            <li>• Use a clear, professional photo</li>
            <li>• Make sure your email is valid for notifications</li>
            <li>• Keep your phone number updated for contact</li>
          </ul>
        </motion.div>
      )}
    </div>
  );
}
