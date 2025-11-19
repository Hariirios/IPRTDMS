import { Event, Service, Testimonial, Video } from './data';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

class DataCache {
    private eventsCache: CacheEntry<Event[]> | null = null;
    private servicesCache: CacheEntry<Service[]> | null = null;
    private testimonialsCache: CacheEntry<Testimonial[]> | null = null;
    private videosCache: CacheEntry<Video[]> | null = null;

    private isValid<T>(cache: CacheEntry<T> | null): boolean {
        if (!cache) return false;
        return Date.now() - cache.timestamp < CACHE_DURATION;
    }

    // Events
    getEvents(): Event[] | null {
        if (this.isValid(this.eventsCache)) {
            return this.eventsCache!.data;
        }
        return null;
    }

    setEvents(data: Event[]): void {
        this.eventsCache = {
            data,
            timestamp: Date.now(),
        };
    }

    invalidateEvents(): void {
        this.eventsCache = null;
    }

    // Services
    getServices(): Service[] | null {
        if (this.isValid(this.servicesCache)) {
            return this.servicesCache!.data;
        }
        return null;
    }

    setServices(data: Service[]): void {
        this.servicesCache = {
            data,
            timestamp: Date.now(),
        };
    }

    invalidateServices(): void {
        this.servicesCache = null;
    }

    // Testimonials
    getTestimonials(): Testimonial[] | null {
        if (this.isValid(this.testimonialsCache)) {
            return this.testimonialsCache!.data;
        }
        return null;
    }

    setTestimonials(data: Testimonial[]): void {
        this.testimonialsCache = {
            data,
            timestamp: Date.now(),
        };
    }

    invalidateTestimonials(): void {
        this.testimonialsCache = null;
    }

    // Videos
    getVideos(): Video[] | null {
        if (this.isValid(this.videosCache)) {
            return this.videosCache!.data;
        }
        return null;
    }

    setVideos(data: Video[]): void {
        this.videosCache = {
            data,
            timestamp: Date.now(),
        };
    }

    invalidateVideos(): void {
        this.videosCache = null;
    }

    // Clear all cache
    clearAll(): void {
        this.eventsCache = null;
        this.servicesCache = null;
        this.testimonialsCache = null;
        this.videosCache = null;
    }
}

export const dataCache = new DataCache();
