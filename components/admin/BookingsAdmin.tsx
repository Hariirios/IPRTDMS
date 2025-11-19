import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Trash2, Download, Search, Calendar, Mail, Phone, Clock, FileText, Filter, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface Booking {
    id: string;
    name: string;
    email: string;
    phone: string;
    service_type: string;
    service_id: string;
    service_name: string;
    booking_date: string;
    booking_time: string;
    message: string | null;
    status: string;
    created_at: string;
}

export function BookingsAdmin() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    useEffect(() => {
        loadBookings();
    }, []);

    useEffect(() => {
        filterBookings();
    }, [searchTerm, statusFilter, bookings]);

    const loadBookings = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBookings(data || []);
        } catch (error) {
            console.error('Error loading bookings:', error);
            toast.error('Failed to load bookings');
        } finally {
            setIsLoading(false);
        }
    };

    const filterBookings = () => {
        let filtered = bookings;

        if (searchTerm) {
            filtered = filtered.filter(booking =>
                booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.phone.includes(searchTerm) ||
                booking.service_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(booking => booking.status === statusFilter);
        }

        setFilteredBookings(filtered);
    };

    const deleteBooking = async (id: string) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setBookings(bookings.filter(b => b.id !== id));
            toast.success('Booking deleted successfully');
        } catch (error) {
            console.error('Error deleting booking:', error);
            toast.error('Failed to delete booking');
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq('id', id);

            if (error) throw error;

            setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
            toast.success('Status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const exportToExcel = () => {
        const csvContent = [
            ['Name', 'Email', 'Phone', 'Service Type', 'Service Name', 'Date', 'Time', 'Message', 'Status', 'Created At'],
            ...filteredBookings.map(b => [
                b.name,
                b.email,
                b.phone,
                b.service_type,
                b.service_name,
                b.booking_date,
                b.booking_time,
                b.message || '',
                b.status,
                new Date(b.created_at).toLocaleString()
            ])
        ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        toast.success('Bookings exported successfully');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        }
    };

    if (isLoading) {
        return <div className="text-center py-12">Loading bookings...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#3B0764] dark:text-[#8B5CF6]">Bookings Management</h2>
                    <p className="text-gray-600 dark:text-gray-400">View and manage all booking requests</p>
                </div>
                <Button
                    onClick={exportToExcel}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={filteredBookings.length === 0}
                >
                    <Download className="h-4 w-4 mr-2" />
                    Export to Excel
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by name, email, phone, or service..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {filteredBookings.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    No bookings found
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {filteredBookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="bg-gradient-to-br from-[#8B5CF6]/10 to-[#3B0764]/10 dark:from-[#3B0764]/20 dark:to-[#3B0764]/20 border border-[#3B0764]/20 dark:border-[#8B5CF6]/20 rounded-xl p-5 flex flex-col hover:shadow-lg hover:shadow-[#3B0764]/20 transition-all duration-300"
                        >
                            <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-lg text-[#3B0764] dark:text-[#8B5CF6]">{booking.name}</h3>
                                        <div className="mt-1 space-y-0.5">
                                            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                                <Mail className="h-3 w-3 mr-1.5 flex-shrink-0" />
                                                <span className="truncate">{booking.email}</span>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                                <Phone className="h-3 w-3 mr-1.5 flex-shrink-0" />
                                                {booking.phone}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{booking.service_name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{booking.service_type}</p>
                                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                        <Calendar className="h-3 w-3 mr-1.5" />
                                        {booking.booking_date}
                                    </div>
                                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                        <Clock className="h-3 w-3 mr-1.5" />
                                        {booking.booking_time}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4 pt-4 border-t border-[#3B0764]/20 dark:border-[#8B5CF6]/20">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 border-[#3B0764] text-[#3B0764] hover:bg-[#3B0764] hover:text-white dark:border-[#8B5CF6] dark:text-[#8B5CF6] dark:hover:bg-[#8B5CF6] dark:hover:text-[#3B0764]"
                                            onClick={() => setSelectedBooking(booking)}
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            View
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>Booking Details</DialogTitle>
                                        </DialogHeader>
                                        {selectedBooking && (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                                                        <p className="text-gray-900 dark:text-white">{selectedBooking.name}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                                                        <div className="mt-1">
                                                            <Select
                                                                value={selectedBooking.status}
                                                                onValueChange={(value) => updateStatus(selectedBooking.id, value)}
                                                            >
                                                                <SelectTrigger className={`w-full ${getStatusColor(selectedBooking.status)}`}>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="pending">Pending</SelectItem>
                                                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                                                    <p className="text-gray-900 dark:text-white">{selectedBooking.email}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                                                    <p className="text-gray-900 dark:text-white">{selectedBooking.phone}</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Service</label>
                                                        <p className="text-gray-900 dark:text-white">{selectedBooking.service_name}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{selectedBooking.service_type}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date & Time</label>
                                                        <p className="text-gray-900 dark:text-white">{selectedBooking.booking_date}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{selectedBooking.booking_time}</p>
                                                    </div>
                                                </div>
                                                {selectedBooking.message && (
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Message</label>
                                                        <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{selectedBooking.message}</p>
                                                    </div>
                                                )}
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</label>
                                                    <p className="text-gray-900 dark:text-white">
                                                        {new Date(selectedBooking.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </DialogContent>
                                </Dialog>
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
                                            <AlertDialogTitle>Delete Booking</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete this booking from {booking.name}? This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => deleteBooking(booking.id)}>
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredBookings.length} of {bookings.length} bookings
            </div>
        </div>
    );
}
