import React, { useState, useEffect } from 'react';
import { Testimonial } from '../../lib/data';
import { getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial } from '../../lib/storage';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    const data = await getTestimonials();
    setTestimonials(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent duplicate submissions
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const role = formData.get('role') as string;
    const feedback = formData.get('feedback') as string;

    const testimonialData: Testimonial = {
      id: editingTestimonial?.id || crypto.randomUUID(),
      name: 'Client', // Always use "Client" as the name
      role: role,
      roleSo: role, // Using same role for Somali
      rating: parseInt(formData.get('rating') as string),
      feedback: feedback,
      feedbackSo: feedback, // Using same feedback for Somali
      serviceType: 'General Service', // Default service type
    };

    try {
      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial.id, testimonialData);
        toast.success('Testimonial updated successfully');
      } else {
        await addTestimonial(testimonialData);
        toast.success('Testimonial added successfully');
      }

      await loadTestimonials();
      setIsDialogOpen(false);
      setEditingTestimonial(null);
    } catch (error) {
      toast.error('Failed to save testimonial. Please try again.');
      console.error('Error saving testimonial:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTestimonial(id);
      await loadTestimonials();
      toast.success('Testimonial deleted successfully');
    } catch (error) {
      toast.error('Failed to delete testimonial. Please try again.');
      console.error('Error deleting testimonial:', error);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingTestimonial(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-[#3B0764] dark:text-[#8B5CF6]">Testimonials Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleAddNew}
              className="bg-gradient-to-r from-[#3B0764] to-[#3B0764] hover:from-[#3B0764] hover:to-[#3B0764] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
              <DialogDescription>
                {editingTestimonial ? 'Update the testimonial details below.' : 'Fill in the details to add a new testimonial.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <select
                    id="rating"
                    name="rating"
                    defaultValue={editingTestimonial?.rating || 5}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    required
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 stars)</option>
                    <option value="4">⭐⭐⭐⭐ (4 stars)</option>
                    <option value="3">⭐⭐⭐ (3 stars)</option>
                    <option value="2">⭐⭐ (2 stars)</option>
                    <option value="1">⭐ (1 star)</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="role">Client Role</Label>
                  <Input id="role" name="role" defaultValue={editingTestimonial?.role} placeholder="e.g., Business Owner, Teacher" required />
                </div>
              </div>

              <div>
                <Label htmlFor="feedback">Client Feedback</Label>
                <Textarea id="feedback" name="feedback" defaultValue={editingTestimonial?.feedback} placeholder="Share the client's testimonial..." required rows={5} />
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
                  {isSubmitting ? 'Saving...' : editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-gradient-to-br from-[#8B5CF6]/10 to-[#3B0764]/10 dark:from-[#3B0764]/20 dark:to-[#3B0764]/20 border border-[#3B0764]/20 dark:border-[#8B5CF6]/20 rounded-xl p-5 flex flex-col hover:shadow-lg hover:shadow-[#3B0764]/20 transition-all duration-300">
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg text-[#3B0764] dark:text-[#8B5CF6]">Client</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{testimonial.feedback}</p>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-[#3B0764]/20 dark:border-[#8B5CF6]/20">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(testimonial)}
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
                    <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete the testimonial from "{testimonial.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(testimonial.id)}>
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
