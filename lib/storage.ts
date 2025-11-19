import { Event, Service, Testimonial, Mentor, Video } from './data';
import { supabase } from './supabase';
import { dataCache } from './cache';

// Helper function to convert database row to Event
const dbToEvent = (row: any): Event => ({
    id: row.id,
    title: row.title,
    titleSo: row.title_so,
    description: row.description,
    descriptionSo: row.description_so,
    fullDescription: row.full_description,
    fullDescriptionSo: row.full_description_so,
    date: row.date,
    location: row.location,
    locationSo: row.location_so,
    speakers: row.speakers,
    image: row.image,
    isPast: row.is_past,
    isFree: row.is_free ?? true,
    price: row.price,
});

// Helper function to convert Event to database row
const eventToDb = (event: Event) => ({
    id: event.id,
    title: event.title,
    title_so: event.titleSo,
    description: event.description,
    description_so: event.descriptionSo,
    full_description: event.fullDescription,
    full_description_so: event.fullDescriptionSo,
    date: event.date,
    location: event.location,
    location_so: event.locationSo,
    speakers: event.speakers,
    image: event.image,
    is_past: event.isPast,
    is_free: event.isFree,
    price: event.price,
});

// Helper function to convert database row to Service (with mentors)
const dbToService = (row: any, mentors: Mentor[]): Service => ({
    id: row.id,
    title: row.title,
    titleSo: row.title_so,
    description: row.description,
    descriptionSo: row.description_so,
    fullDescription: row.full_description,
    fullDescriptionSo: row.full_description_so,
    icon: row.icon,
    mentors: mentors,
});

// Helper function to convert Mentor to database row
const mentorToDb = (mentor: Mentor, serviceId: string) => ({
    id: mentor.id,
    service_id: serviceId,
    name: mentor.name,
    role: mentor.role,
    role_so: mentor.roleSo,
    bio: mentor.bio,
    bio_so: mentor.bioSo,
    image: mentor.image,
});

// Helper function to convert database row to Mentor
const dbToMentor = (row: any): Mentor => ({
    id: row.id,
    name: row.name,
    role: row.role,
    roleSo: row.role_so,
    bio: row.bio,
    bioSo: row.bio_so,
    image: row.image,
});

// Helper function to convert database row to Testimonial
const dbToTestimonial = (row: any): Testimonial => ({
    id: row.id,
    name: row.name,
    role: row.role,
    roleSo: row.role_so,
    rating: row.rating,
    feedback: row.feedback,
    feedbackSo: row.feedback_so,
    serviceType: row.service_type,
});

// Helper function to convert Testimonial to database row
const testimonialToDb = (testimonial: Testimonial) => ({
    id: testimonial.id,
    name: testimonial.name,
    role: testimonial.role,
    role_so: testimonial.roleSo,
    rating: testimonial.rating,
    feedback: testimonial.feedback,
    feedback_so: testimonial.feedbackSo,
    service_type: testimonial.serviceType,
});

// Helper function to convert database row to Video
const dbToVideo = (row: any): Video => ({
    id: row.id,
    title: row.title,
    description: row.description,
    youtubeUrl: row.youtube_url,
    youtubeId: row.youtube_id,
});

// Helper function to convert Video to database row
const videoToDb = (video: Video) => ({
    id: video.id,
    title: video.title,
    description: video.description,
    youtube_url: video.youtubeUrl,
    youtube_id: video.youtubeId,
});

// Events
export const getEvents = async (): Promise<Event[]> => {
    // Check cache first
    const cached = dataCache.getEvents();
    if (cached) {
        return cached;
    }

    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching events:', error);
        return [];
    }

    const events = data ? data.map(dbToEvent) : [];
    dataCache.setEvents(events);
    return events;
};

export const addEvent = async (event: Event): Promise<void> => {
    const { error } = await supabase
        .from('events')
        .insert([eventToDb(event)]);

    if (error) {
        console.error('Error adding event:', error);
        throw error;
    }

    dataCache.invalidateEvents();
};

export const updateEvent = async (id: string, updatedEvent: Event): Promise<void> => {
    const { error } = await supabase
        .from('events')
        .update(eventToDb(updatedEvent))
        .eq('id', id);

    if (error) {
        console.error('Error updating event:', error);
        throw error;
    }

    dataCache.invalidateEvents();
};

export const deleteEvent = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting event:', error);
        throw error;
    }

    dataCache.invalidateEvents();
};

// Services
export const getServices = async (): Promise<Service[]> => {
    // Check cache first
    const cached = dataCache.getServices();
    if (cached) {
        return cached;
    }

    const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });

    if (servicesError) {
        console.error('Error fetching services:', servicesError);
        return [];
    }

    if (!servicesData) return [];

    // Fetch mentors for all services
    const { data: mentorsData, error: mentorsError } = await supabase
        .from('mentors')
        .select('*');

    if (mentorsError) {
        console.error('Error fetching mentors:', mentorsError);
    }

    // Group mentors by service_id
    const mentorsByService: { [key: string]: Mentor[] } = {};
    if (mentorsData) {
        mentorsData.forEach((mentorRow: any) => {
            const mentor = dbToMentor(mentorRow);
            if (!mentorsByService[mentorRow.service_id]) {
                mentorsByService[mentorRow.service_id] = [];
            }
            mentorsByService[mentorRow.service_id].push(mentor);
        });
    }

    const services = servicesData.map(serviceRow =>
        dbToService(serviceRow, mentorsByService[serviceRow.id] || [])
    );

    dataCache.setServices(services);
    return services;
};

export const addService = async (service: Service): Promise<void> => {
    const { id, title, titleSo, description, descriptionSo, fullDescription, fullDescriptionSo, icon } = service;

    const { error: serviceError } = await supabase
        .from('services')
        .insert([{
            id,
            title,
            title_so: titleSo,
            description,
            description_so: descriptionSo,
            full_description: fullDescription,
            full_description_so: fullDescriptionSo,
            icon,
        }]);

    if (serviceError) {
        console.error('Error adding service:', serviceError);
        throw serviceError;
    }

    // Add mentors
    if (service.mentors && service.mentors.length > 0) {
        const mentorsToInsert = service.mentors.map(mentor => mentorToDb(mentor, id));
        const { error: mentorsError } = await supabase
            .from('mentors')
            .insert(mentorsToInsert);

        if (mentorsError) {
            console.error('Error adding mentors:', mentorsError);
            throw mentorsError;
        }
    }

    dataCache.invalidateServices();
};

export const updateService = async (id: string, updatedService: Service): Promise<void> => {
    const { title, titleSo, description, descriptionSo, fullDescription, fullDescriptionSo, icon } = updatedService;

    const { error: serviceError } = await supabase
        .from('services')
        .update({
            title,
            title_so: titleSo,
            description,
            description_so: descriptionSo,
            full_description: fullDescription,
            full_description_so: fullDescriptionSo,
            icon,
        })
        .eq('id', id);

    if (serviceError) {
        console.error('Error updating service:', serviceError);
        throw serviceError;
    }

    // Delete existing mentors and add new ones
    await supabase.from('mentors').delete().eq('service_id', id);

    if (updatedService.mentors && updatedService.mentors.length > 0) {
        const mentorsToInsert = updatedService.mentors.map(mentor => mentorToDb(mentor, id));
        const { error: mentorsError } = await supabase
            .from('mentors')
            .insert(mentorsToInsert);

        if (mentorsError) {
            console.error('Error updating mentors:', mentorsError);
            throw mentorsError;
        }
    }

    dataCache.invalidateServices();
};

export const deleteService = async (id: string): Promise<void> => {
    // Mentors will be deleted automatically due to CASCADE
    const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting service:', error);
        throw error;
    }

    dataCache.invalidateServices();
};

// Testimonials
export const getTestimonials = async (): Promise<Testimonial[]> => {
    // Check cache first
    const cached = dataCache.getTestimonials();
    if (cached) {
        return cached;
    }

    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching testimonials:', error);
        return [];
    }

    const testimonials = data ? data.map(dbToTestimonial) : [];
    dataCache.setTestimonials(testimonials);
    return testimonials;
};

export const addTestimonial = async (testimonial: Testimonial): Promise<void> => {
    const { error } = await supabase
        .from('testimonials')
        .insert([testimonialToDb(testimonial)]);

    if (error) {
        console.error('Error adding testimonial:', error);
        throw error;
    }

    dataCache.invalidateTestimonials();
};

export const updateTestimonial = async (id: string, updatedTestimonial: Testimonial): Promise<void> => {
    const { error } = await supabase
        .from('testimonials')
        .update(testimonialToDb(updatedTestimonial))
        .eq('id', id);

    if (error) {
        console.error('Error updating testimonial:', error);
        throw error;
    }

    dataCache.invalidateTestimonials();
};

export const deleteTestimonial = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting testimonial:', error);
        throw error;
    }

    dataCache.invalidateTestimonials();
};

// Videos
export const getVideos = async (): Promise<Video[]> => {
    // Check cache first
    const cached = dataCache.getVideos();
    if (cached) {
        return cached;
    }

    const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching videos:', error);
        return [];
    }

    const videos = data ? data.map(dbToVideo) : [];
    dataCache.setVideos(videos);
    return videos;
};

export const addVideo = async (video: Video): Promise<void> => {
    const { error } = await supabase
        .from('videos')
        .insert([videoToDb(video)]);

    if (error) {
        console.error('Error adding video:', error);
        throw error;
    }

    dataCache.invalidateVideos();
};

export const updateVideo = async (id: string, updatedVideo: Video): Promise<void> => {
    const { error } = await supabase
        .from('videos')
        .update(videoToDb(updatedVideo))
        .eq('id', id);

    if (error) {
        console.error('Error updating video:', error);
        throw error;
    }

    dataCache.invalidateVideos();
};

export const deleteVideo = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting video:', error);
        throw error;
    }

    dataCache.invalidateVideos();
};
