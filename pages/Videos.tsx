import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Video } from '../lib/data';
import { getVideos } from '../lib/storage';

export default function Videos() {
    const { t } = useLanguage();
    const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadVideos();
    }, []);

    const loadVideos = async () => {
        try {
            const data = await getVideos();
            setVideos(data);
        } catch (error) {
            console.error('Error loading videos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVideoClick = (youtubeId: string) => {
        window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B0764] mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">Loading videos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#3B0764] to-[#3B0764] bg-clip-text text-transparent">
                        {t.videos?.title || 'Highlight Videos'}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        {t.videos?.subtitle || 'Watch our collection of educational videos on mental wellness, personal growth, and community support'}
                    </p>
                </motion.div>

                {videos.length === 0 ? (
                    <div className="text-center py-12">
                        <Play className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                        <p className="text-gray-600 dark:text-gray-400">No videos available yet. Check back soon!</p>
                    </div>
                ) : (
                    /* Video Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {videos.map((video, index) => (
                            <motion.div
                                key={video.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group cursor-pointer"
                                onMouseEnter={() => setHoveredVideo(video.id)}
                                onMouseLeave={() => setHoveredVideo(null)}
                                onClick={() => handleVideoClick(video.youtubeId)}
                            >
                                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                    {/* Thumbnail */}
                                    <div className="relative aspect-video overflow-hidden bg-gray-200 dark:bg-gray-700">
                                        <img
                                            src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                                            alt={video.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            onError={(e) => {
                                                e.currentTarget.src = `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`;
                                            }}
                                        />

                                        {/* Play Overlay */}
                                        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${hoveredVideo === video.id ? 'opacity-100' : 'opacity-0'
                                            }`}>
                                            <motion.div
                                                initial={{ scale: 0.8 }}
                                                animate={{ scale: hoveredVideo === video.id ? 1 : 0.8 }}
                                                className="bg-[#3B0764] rounded-full p-4"
                                            >
                                                <Play className="w-12 h-12 text-white fill-white" />
                                            </motion.div>
                                        </div>

                                        {/* External Link Icon */}
                                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ExternalLink className="w-4 h-4 text-[#3B0764]" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-[#3B0764] dark:group-hover:text-[#8B5CF6] transition-colors">
                                            {video.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                                            {video.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
