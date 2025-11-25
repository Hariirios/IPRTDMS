import React, { useState, useEffect } from 'react';
import { Service } from '../../lib/data';
import { getServices, addService, updateService, deleteService } from '../../lib/storage';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Edit, Trash2, Upload, X, Brain, Users, Heart, MessageCircle, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface MentorForm {
    name: string;
    role: string;
    bio: string;
    image: string;
}

export function ServicesAdmin() {
    const [services, setServices] = useState<Service[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [selectedIcon, setSelectedIcon] = useState<string>('Brain');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mentors, setMentors] = useState<MentorForm[]>([{ name: '', role: '', bio: '', image: '' }]);

    const iconOptions = [
        { value: 'Brain', label: 'Mental Health / Therapy', icon: Brain },
        { value: 'Users', label: 'Group Support / Community', icon: Users },
        { value: 'Heart', label: 'Wellness / Self-Care', icon: Heart },
        { value: 'MessageCircle', label: 'Counseling / Consultation', icon: MessageCircle },
    ];

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        const data = await getServices();
        setServices(data);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isSubmitting) return; // Prevent duplicate submissions
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;

        // Filter out empty mentors and map to proper format
        const filteredMentors = mentors
            .filter(m => m.name.trim() !== '')
            .map((mentor, index) => ({
                id: editingService?.mentors[index]?.id || crypto.randomUUID(),
                name: mentor.name,
                role: mentor.role,
                roleSo: mentor.role,
                bio: mentor.bio,
                bioSo: mentor.bio,
                image: mentor.image || 'https://images.unsplash.com/photo-1758273241078-8eec353836be?w=1080',
            }));

        const serviceData: Service = {
            id: editingService?.id || crypto.randomUUID(),
            title: title,
            titleSo: title, // Using same title for Somali
            description: description,
            descriptionSo: description, // Using same description for Somali
            fullDescription: description,
            fullDescriptionSo: description,
            icon: selectedIcon,
            mentors: filteredMentors,
        };

        try {
            if (editingService) {
                await updateService(editingService.id, serviceData);
                toast.success('Service updated successfully');
            } else {
                await addService(serviceData);
                toast.success('Service added successfully');
            }

            await loadServices();
            setIsDialogOpen(false);
            setEditingService(null);
            setMentors([{ name: '', role: '', bio: '', image: '' }]);
            setSelectedIcon('Brain');
        } catch (error) {
            toast.error('Failed to save service. Please try again.');
            console.error('Error saving service:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteService(id);
            await loadServices();
            toast.success('Service deleted successfully');
        } catch (error) {
            toast.error('Failed to delete service. Please try again.');
            console.error('Error deleting service:', error);
        }
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        const mentorForms = service.mentors.length > 0
            ? service.mentors.map(m => ({ name: m.name, role: m.role, bio: m.bio, image: m.image }))
            : [{ name: '', role: '', bio: '', image: '' }];
        setMentors(mentorForms);
        setSelectedIcon(service.icon || 'Brain');
        setIsDialogOpen(true);
    };

    const handleAddNew = () => {
        setEditingService(null);
        setMentors([{ name: '', role: '', bio: '', image: '' }]);
        setSelectedIcon('Brain');
        setIsDialogOpen(true);
    };

    const addMentor = () => {
        setMentors([...mentors, { name: '', role: '', bio: '', image: '' }]);
    };

    const removeMentor = (index: number) => {
        if (mentors.length > 1) {
            setMentors(mentors.filter((_, i) => i !== index));
        }
    };

    const updateMentor = (index: number, field: keyof MentorForm, value: string) => {
        const newMentors = [...mentors];
        newMentors[index][field] = value;
        setMentors(newMentors);
    };

    const handleMentorImageChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // Import the image utility
            const { handleImageUpload: processImage } = await import('../../lib/imageUtils');
            
            // Show loading toast
            const loadingToast = toast.loading('Processing image with ULTRA HIGH quality...');
            
            // Process image with 100% quality - NO compression for maximum clarity
            const compressedImage = await processImage(file, {
                maxWidth: 2000,  // ULTRA high resolution
                maxHeight: 2000, // ULTRA high resolution
                quality: 1.0,    // 100% quality - NO compression!
                outputFormat: file.type.includes('png') ? 'image/png' : 'image/jpeg'
            });
            
            updateMentor(index, 'image', compressedImage);
            
            toast.dismiss(loadingToast);
            toast.success('✨ ULTRA HIGH quality mentor image uploaded!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to upload image');
            console.error('Image upload error:', error);
        }
    };

    const removeMentorImage = (index: number) => {
        updateMentor(index, 'image', '');
        const fileInput = document.getElementById(`mentorImageUpload-${index}`) as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-[#3B0764] dark:text-[#8B5CF6]">Services Management</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={handleAddNew}
                            className="bg-gradient-to-r from-[#3B0764] to-[#3B0764] hover:from-[#3B0764] hover:to-[#3B0764] text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Service
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
                        <DialogHeader>
                            <DialogTitle className="text-lg sm:text-xl">{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                            <DialogDescription>
                                {editingService ? 'Update the service details below.' : 'Fill in the details to create a new service.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                            <div>
                                <Label htmlFor="title">Service Title</Label>
                                <Input id="title" name="title" defaultValue={editingService?.title} placeholder="e.g., Mental Health Coaching" required />
                            </div>

                            <div>
                                <Label htmlFor="description">Service Description</Label>
                                <Textarea id="description" name="description" defaultValue={editingService?.description} placeholder="Brief description of the service" required rows={3} />
                            </div>

                            <div>
                                <Label htmlFor="icon">Service Icon</Label>
                                <Select value={selectedIcon} onValueChange={setSelectedIcon}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an icon" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {iconOptions.map((option) => {
                                            const IconComponent = option.icon;
                                            return (
                                                <SelectItem key={option.value} value={option.value}>
                                                    <div className="flex items-center gap-2">
                                                        <IconComponent className="h-4 w-4" />
                                                        <span>{option.label}</span>
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-[#3B0764] dark:text-[#8B5CF6]">Mentor Information</h3>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addMentor}
                                        className="h-8 text-xs border-[#3B0764] text-[#3B0764] hover:bg-[#3B0764]/10"
                                    >
                                        <UserPlus className="w-3 h-3 mr-1" />
                                        Add Mentor
                                    </Button>
                                </div>

                                <div className="space-y-6">
                                    {mentors.map((mentor, index) => (
                                        <div key={index} className="p-4 border border-[#3B0764]/20 rounded-lg space-y-3 relative">
                                            {mentors.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeMentor(index)}
                                                    className="absolute top-2 right-2 h-8 px-2 border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            )}

                                            <div className="text-sm font-medium text-[#3B0764] dark:text-[#8B5CF6] mb-2">
                                                Mentor {index + 1}
                                            </div>

                                            <div>
                                                <Label htmlFor={`mentorName-${index}`} className="text-sm">Name</Label>
                                                <Input
                                                    id={`mentorName-${index}`}
                                                    value={mentor.name}
                                                    onChange={(e) => updateMentor(index, 'name', e.target.value)}
                                                    placeholder="e.g., Dr. Amina Hassan"
                                                    className="text-sm"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor={`mentorRole-${index}`} className="text-sm">Role</Label>
                                                <Input
                                                    id={`mentorRole-${index}`}
                                                    value={mentor.role}
                                                    onChange={(e) => updateMentor(index, 'role', e.target.value)}
                                                    placeholder="e.g., Clinical Psychologist"
                                                    className="text-sm"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor={`mentorBio-${index}`} className="text-sm">Description</Label>
                                                <Textarea
                                                    id={`mentorBio-${index}`}
                                                    value={mentor.bio}
                                                    onChange={(e) => updateMentor(index, 'bio', e.target.value)}
                                                    placeholder="Brief bio of the mentor"
                                                    rows={2}
                                                    className="text-sm"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor={`mentorImageUpload-${index}`} className="text-sm">Upload Image</Label>
                                                <div className="mt-2">
                                                    {mentor.image ? (
                                                        <div className="relative">
                                                            <img
                                                                src={mentor.image}
                                                                alt="Mentor Preview"
                                                                className="w-full h-32 object-cover rounded-lg border border-[#3B0764]/20"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeMentorImage(index)}
                                                                className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <label
                                                            htmlFor={`mentorImageUpload-${index}`}
                                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#3B0764]/30 dark:border-[#8B5CF6]/30 rounded-lg cursor-pointer hover:border-[#3B0764] dark:hover:border-[#8B5CF6] transition-colors"
                                                        >
                                                            <Upload className="w-8 h-8 text-[#3B0764] dark:text-[#8B5CF6] mb-1" />
                                                            <p className="text-xs text-gray-600 dark:text-gray-300">Click to upload</p>
                                                            <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                                                        </label>
                                                    )}
                                                    <input
                                                        id={`mentorImageUpload-${index}`}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleMentorImageChange(index, e)}
                                                        className="hidden"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="border-[#3B0764] text-[#3B0764] hover:bg-[#3B0764]/10 w-full sm:w-auto"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-gradient-to-r from-[#3B0764] to-[#3B0764] hover:from-[#3B0764] hover:to-[#3B0764] text-white w-full sm:w-auto"
                                >
                                    {isSubmitting ? 'Saving...' : editingService ? 'Update Service' : 'Add Service'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {services.map((service) => (
                    <div key={service.id} className="bg-gradient-to-br from-[#8B5CF6]/10 to-[#3B0764]/10 dark:from-[#3B0764]/20 dark:to-[#3B0764]/20 border border-[#3B0764]/20 dark:border-[#8B5CF6]/20 rounded-xl p-5 flex flex-col hover:shadow-lg hover:shadow-[#3B0764]/20 transition-all duration-300">
                        <div className="flex-1 space-y-3">
                            <h3 className="font-bold text-lg text-[#3B0764] dark:text-[#8B5CF6] line-clamp-2">{service.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{service.description}</p>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                <span className="font-medium text-[#3B0764] dark:text-[#8B5CF6]">Icon:</span> {service.icon}
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4 pt-4 border-t border-[#3B0764]/20 dark:border-[#8B5CF6]/20">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(service)}
                                className="flex-1 border-[#3B0764] text-[#3B0764] hover:bg-[#3B0764] hover:text-white dark:border-[#8B5CF6] dark:text-[#8B5CF6] dark:hover:bg-[#8B5CF6] dark:hover:text-[#3B0764]"
                            >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="flex-1 bg-red-500 hover:bg-red-600"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Service</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete "{service.title}"? This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(service.id)}>
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
