import React, { useState, useEffect } from 'react';
import { Event } from '../../lib/data';
import { getEvents, addEvent, updateEvent, deleteEvent } from '../../lib/storage';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Plus, Edit, Trash2, Upload, X, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

export function EventsAdmin() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [speakers, setSpeakers] = useState<string[]>(['']);
    const [isFree, setIsFree] = useState(true);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        const data = await getEvents();
        setEvents(data);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isSubmitting) return; // Prevent duplicate submissions
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const eventStatus = formData.get('eventStatus') as string;

        // Filter out empty speakers
        const filteredSpeakers = speakers.filter(s => s.trim() !== '');

        const price = formData.get('price') as string;

        const eventData: Event = {
            id: editingEvent?.id || crypto.randomUUID(),
            title: title,
            titleSo: title, // Using same title for Somali
            description: description,
            descriptionSo: description, // Using same description for Somali
            fullDescription: description,
            fullDescriptionSo: description,
            date: formData.get('date') as string,
            location: formData.get('location') as string,
            locationSo: formData.get('location') as string, // Using same location for Somali
            speakers: filteredSpeakers,
            image: imagePreview || editingEvent?.image || 'https://images.unsplash.com/photo-1635545999375-057ee4013deb?w=1080',
            isPast: eventStatus === 'past',
            isFree: isFree,
            price: isFree ? undefined : parseFloat(price) || 0,
        };

        try {
            if (editingEvent) {
                await updateEvent(editingEvent.id, eventData);
                toast.success('Event updated successfully');
            } else {
                await addEvent(eventData);
                toast.success('Event added successfully');
            }

            await loadEvents();
            setIsDialogOpen(false);
            setEditingEvent(null);
            setImagePreview('');
            setSpeakers(['']);
        } catch (error) {
            toast.error('Failed to save event. Please try again.');
            console.error('Error saving event:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteEvent(id);
            await loadEvents();
            toast.success('Event deleted successfully');
        } catch (error) {
            toast.error('Failed to delete event. Please try again.');
            console.error('Error deleting event:', error);
        }
    };

    const handleEdit = (event: Event) => {
        setEditingEvent(event);
        setImagePreview(event.image);
        setSpeakers(event.speakers.length > 0 ? event.speakers : ['']);
        setIsFree(event.isFree);
        setIsDialogOpen(true);
    };

    const handleAddNew = () => {
        setEditingEvent(null);
        setImagePreview('');
        setSpeakers(['']);
        setIsFree(true);
        setIsDialogOpen(true);
    };

    const addSpeaker = () => {
        setSpeakers([...speakers, '']);
    };

    const removeSpeaker = (index: number) => {
        if (speakers.length > 1) {
            setSpeakers(speakers.filter((_, i) => i !== index));
        }
    };

    const updateSpeaker = (index: number, value: string) => {
        const newSpeakers = [...speakers];
        newSpeakers[index] = value;
        setSpeakers(newSpeakers);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview('');
        const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-[#3B0764] dark:text-[#8B5CF6]">Events Management</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={handleAddNew}
                            className="bg-gradient-to-r from-[#3B0764] to-[#3B0764] hover:from-[#3B0764] hover:to-[#3B0764] text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Event
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
                        <DialogHeader>
                            <DialogTitle className="text-lg sm:text-xl">{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                            <DialogDescription>
                                {editingEvent ? 'Update the event details below.' : 'Fill in the details to create a new event.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                            <div>
                                <Label htmlFor="title" className="text-sm">Title</Label>
                                <Input id="title" name="title" defaultValue={editingEvent?.title} placeholder="Event title" required className="text-sm" />
                            </div>

                            <div>
                                <Label htmlFor="description" className="text-sm">Description</Label>
                                <Textarea id="description" name="description" defaultValue={editingEvent?.description} placeholder="Brief description of the event" required rows={3} className="text-sm" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <Label htmlFor="date" className="text-sm">Date</Label>
                                    <Input id="date" name="date" type="date" defaultValue={editingEvent?.date} required className="text-sm" />
                                </div>
                                <div>
                                    <Label htmlFor="eventStatus" className="text-sm">Event Status</Label>
                                    <select
                                        id="eventStatus"
                                        name="eventStatus"
                                        defaultValue={editingEvent?.isPast ? 'past' : 'upcoming'}
                                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                                        required
                                    >
                                        <option value="upcoming">Upcoming</option>
                                        <option value="past">Past</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="location" className="text-sm">Location</Label>
                                <Input id="location" name="location" defaultValue={editingEvent?.location} placeholder="Event location" required className="text-sm" />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Is Event Free or Paid?</Label>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="radio"
                                            id="eventFree"
                                            name="eventPricing"
                                            checked={isFree}
                                            onChange={() => setIsFree(true)}
                                            className="w-4 h-4 text-[#3B0764] border-gray-300 focus:ring-[#3B0764]"
                                        />
                                        <Label htmlFor="eventFree" className="text-sm font-normal cursor-pointer">
                                            Free Event
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="radio"
                                            id="eventPaid"
                                            name="eventPricing"
                                            checked={!isFree}
                                            onChange={() => setIsFree(false)}
                                            className="w-4 h-4 text-[#3B0764] border-gray-300 focus:ring-[#3B0764]"
                                        />
                                        <Label htmlFor="eventPaid" className="text-sm font-normal cursor-pointer">
                                            Paid Event
                                        </Label>
                                    </div>
                                </div>
                                {!isFree && (
                                    <div className="mt-3 pl-7">
                                        <Label htmlFor="price" className="text-sm">Event Fee (USD)</Label>
                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            defaultValue={editingEvent?.price || ''}
                                            placeholder="Enter price in dollars (e.g., 25.00)"
                                            required={!isFree}
                                            className="text-sm mt-1"
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <Label className="text-sm">Speakers</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addSpeaker}
                                        className="h-8 text-xs border-[#3B0764] text-[#3B0764] hover:bg-[#3B0764]/10"
                                    >
                                        <UserPlus className="w-3 h-3 mr-1" />
                                        Add Speaker
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {speakers.map((speaker, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                value={speaker}
                                                onChange={(e) => updateSpeaker(index, e.target.value)}
                                                placeholder={`Speaker ${index + 1} name`}
                                                className="text-sm flex-1"
                                            />
                                            {speakers.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeSpeaker(index)}
                                                    className="h-10 px-3 border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="imageUpload" className="text-sm">Upload Event Image</Label>
                                <div className="mt-2">
                                    {(imagePreview || editingEvent?.image) ? (
                                        <div className="relative">
                                            <img
                                                src={imagePreview || editingEvent?.image}
                                                alt="Preview"
                                                className="w-full h-40 sm:h-48 object-cover rounded-lg border border-[#3B0764]/20"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 sm:p-2 rounded-full hover:bg-red-600 shadow-lg"
                                            >
                                                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor="imageUpload"
                                            className="flex flex-col items-center justify-center w-full h-40 sm:h-48 border-2 border-dashed border-[#3B0764]/30 dark:border-[#8B5CF6]/30 rounded-lg cursor-pointer hover:border-[#3B0764] dark:hover:border-[#8B5CF6] transition-colors"
                                        >
                                            <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-[#3B0764] dark:text-[#8B5CF6] mb-2" />
                                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 px-2 text-center">Click to upload image</p>
                                            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                                        </label>
                                    )}
                                    <input
                                        id="imageUpload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
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
                                    {isSubmitting ? 'Saving...' : editingEvent ? 'Update Event' : 'Add Event'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {events.map((event) => (
                    <div key={event.id} className="bg-gradient-to-br from-[#8B5CF6]/10 to-[#3B0764]/10 dark:from-[#3B0764]/20 dark:to-[#3B0764]/20 border border-[#3B0764]/20 dark:border-[#8B5CF6]/20 rounded-xl p-5 flex flex-col hover:shadow-lg hover:shadow-[#3B0764]/20 transition-all duration-300">
                        <div className="flex-1 space-y-3">
                            <h3 className="font-bold text-lg text-[#3B0764] dark:text-[#8B5CF6] line-clamp-2">{event.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{event.description}</p>
                            <div className="text-xs space-y-1 text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-[#3B0764] dark:text-[#8B5CF6]">Date:</span>
                                    <span>{event.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-[#3B0764] dark:text-[#8B5CF6]">Location:</span>
                                    <span className="line-clamp-1">{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-[#3B0764] dark:text-[#8B5CF6]">Price:</span>
                                    <span className="font-semibold">
                                        {event.isFree ? 'Free' : `$${event.price?.toFixed(2)}`}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4 pt-4 border-t border-[#3B0764]/20 dark:border-[#8B5CF6]/20">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(event)}
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
                                        <AlertDialogTitle>Delete Event</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete "{event.title}"? This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(event.id)}>
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
