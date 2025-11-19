import React, { useState, useEffect } from 'react';
import { Video } from '../../lib/data';
import { getVideos, addVideo, updateVideo, deleteVideo } from '../../lib/storage';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Plus, Edit, Trash2, ExternalLink, Play } from 'lucide-react';
import { toast } from 'sonner';

export function VideosAdmin() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingVideo, setEditingVideo] = useState<Video | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadVideos();
    }, []);

    const loadVideos = async () => {
        const data = await getVideos();
        setVideos(data);
    };

    const extractYoutubeId = (url: string): string => {
        // Handle various YouTube URL formats
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }

        return url; // Return as-is if no pattern matches
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isSubmitting) return;
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const youtubeUrl = formData.get('youtubeUrl') as string;
        const youtubeId = extractYoutubeId(youtubeUrl);

        const videoData: Video = {
            id: editingVideo?.id || crypto.randomUUID(),
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            youtubeUrl: youtubeUrl,
            youtubeId: youtubeId,
        };

        try {
            if (editingVideo) {
                await updateVideo(editingVideo.id, videoData);
                toast.success('Video updated successfully');
            } else {
                await addVideo(videoData);
                toast.success('Video added successfully');
            }

            await loadVideos();
            setIsDialogOpen(false);
            setEditingVideo(null);
        } catch (error) {
            toast.error('Failed to save video. Please try again.');
            console.error('Error saving video:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteVideo(id);
            await loadVideos();
            toast.success('Video deleted successfully');
        } catch (error) {
            toast.error('Failed to delete video. Please try again.');
            console.error('Error deleting video:', error);
        }
    };

    const handleEdit = (video: Video) => {
        setEditingVideo(video);
        setIsDialogOpen(true);
    };

    const handleAddNew = () => {
        setEditingVideo(null);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-[#3B0764] dark:text-[#8B5CF6]">Videos Management</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={handleAddNew}
                            className="bg-gradient-to-r from-[#3B0764] to-[#3B0764] hover:from-[#3B0764] hover:to-[#3B0764] text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Video
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
                        <DialogHeader>
                            <DialogTitle className="text-lg sm:text-xl">{editingVideo ? 'Edit Video' : 'Add New Video'}</DialogTitle>
                            <DialogDescription>
                                {editingVideo ? 'Update the video details below.' : 'Fill in the details to add a new video.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                            <div>
                                <Label htmlFor="title">Video Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    defaultValue={editingVideo?.title}
                                    placeholder="e.g., Mental Health Awareness Workshop"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="youtubeUrl">YouTube URL or Video ID</Label>
                                <Input
                                    id="youtubeUrl"
                                    name="youtubeUrl"
                                    defaultValue={editingVideo?.youtubeUrl}
                                    placeholder="https://www.youtube.com/watch?v=VIDEO_ID or just VIDEO_ID"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Paste the full YouTube URL or just the video ID (11 characters)
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="description">Short Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    defaultValue={editingVideo?.description}
                                    placeholder="Brief description of the video content..."
                                    required
                                    rows={3}
                                />
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
                                    {isSubmitting ? 'Saving...' : editingVideo ? 'Update Video' : 'Add Video'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {videos.map((video) => (
                    <div key={video.id} className="bg-gradient-to-br from-[#8B5CF6]/10 to-[#3B0764]/10 dark:from-[#3B0764]/20 dark:to-[#3B0764]/20 border border-[#3B0764]/20 dark:border-[#8B5CF6]/20 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[#3B0764]/20 transition-all duration-300">
                        {/* Thumbnail */}
                        <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
                            <img
                                src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                                alt={video.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // Fallback to medium quality thumbnail
                                    e.currentTarget.src = `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`;
                                }}
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <div className="bg-[#3B0764] rounded-full p-3">
                                    <Play className="w-8 h-8 text-white fill-white" />
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-3">
                            <h3 className="font-bold text-lg text-[#3B0764] dark:text-[#8B5CF6] line-clamp-2">
                                {video.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                {video.description}
                            </p>

                            <a
                                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs text-[#3B0764] dark:text-[#8B5CF6] hover:underline"
                            >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Watch on YouTube
                            </a>

                            <div className="flex gap-2 pt-3 border-t border-[#3B0764]/20 dark:border-[#8B5CF6]/20">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(video)}
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
                                            <AlertDialogTitle>Delete Video</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete "{video.title}"? This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(video.id)}>
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {videos.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No videos added yet. Click "Add Video" to get started.</p>
                </div>
            )}
        </div>
    );
}
