import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Trash2, Search, Mail, Clock, MessageSquare, Filter, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface Contact {
    id: string;
    name: string;
    email: string;
    message: string;
    status: string;
    created_at: string;
}

export function ContactsAdmin() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    useEffect(() => {
        loadContacts();
    }, []);

    useEffect(() => {
        filterContacts();
    }, [searchTerm, statusFilter, contacts]);

    const loadContacts = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('contacts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setContacts(data || []);
        } catch (error) {
            console.error('Error loading contacts:', error);
            toast.error('Failed to load contacts');
        } finally {
            setIsLoading(false);
        }
    };

    const filterContacts = () => {
        let filtered = contacts;

        if (searchTerm) {
            filtered = filtered.filter(contact =>
                contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.message.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(contact => contact.status === statusFilter);
        }

        setFilteredContacts(filtered);
    };

    const deleteContact = async (id: string) => {
        try {
            const { error } = await supabase
                .from('contacts')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setContacts(contacts.filter(c => c.id !== id));
            toast.success('Contact deleted successfully');
        } catch (error) {
            console.error('Error deleting contact:', error);
            toast.error('Failed to delete contact');
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('contacts')
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq('id', id);

            if (error) throw error;

            setContacts(contacts.map(c => c.id === id ? { ...c, status: newStatus } : c));
            toast.success('Status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const markAsRead = async (contact: Contact) => {
        if (contact.status === 'new') {
            await updateStatus(contact.id, 'read');
        }
        setSelectedContact(contact);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'replied': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'read': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        }
    };

    if (isLoading) {
        return <div className="text-center py-12">Loading contacts...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#3B0764] dark:text-[#8B5CF6]">Contact Messages</h2>
                    <p className="text-gray-600 dark:text-gray-400">View and manage contact form submissions</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {contacts.filter(c => c.status === 'new').length} new messages
                    </span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by name, email, or message..."
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
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {filteredContacts.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    No contact messages found
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {filteredContacts.map((contact) => (
                        <div
                            key={contact.id}
                            className={`bg-gradient-to-br from-[#8B5CF6]/10 to-[#3B0764]/10 dark:from-[#3B0764]/20 dark:to-[#3B0764]/20 border border-[#3B0764]/20 dark:border-[#8B5CF6]/20 rounded-xl p-5 flex flex-col hover:shadow-lg hover:shadow-[#3B0764]/20 transition-all duration-300 ${contact.status === 'new' ? 'ring-2 ring-yellow-400 dark:ring-yellow-600' : ''}`}
                        >
                            <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <h3 className="font-bold text-lg text-[#3B0764] dark:text-[#8B5CF6]">{contact.name}</h3>
                                            {contact.status === 'new' && (
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-1">
                                            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                                <Mail className="h-3 w-3 mr-1.5 flex-shrink-0" />
                                                <span className="truncate">{contact.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${getStatusColor(contact.status)}`}>
                                        {contact.status}
                                    </span>
                                </div>

                                <div className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                                    <MessageSquare className="h-3 w-3 mr-1.5 mt-0.5 flex-shrink-0" />
                                    <p className="line-clamp-3">{contact.message}</p>
                                </div>

                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {new Date(contact.created_at).toLocaleString()}
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4 pt-4 border-t border-[#3B0764]/20 dark:border-[#8B5CF6]/20">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 border-[#3B0764] text-[#3B0764] hover:bg-[#3B0764] hover:text-white dark:border-[#8B5CF6] dark:text-[#8B5CF6] dark:hover:bg-[#8B5CF6] dark:hover:text-[#3B0764]"
                                            onClick={() => markAsRead(contact)}
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            View
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>Contact Message Details</DialogTitle>
                                        </DialogHeader>
                                        {selectedContact && (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                                                        <p className="text-gray-900 dark:text-white">{selectedContact.name}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                                                        <div className="mt-1">
                                                            <Select
                                                                value={selectedContact.status}
                                                                onValueChange={(value) => updateStatus(selectedContact.id, value)}
                                                            >
                                                                <SelectTrigger className={`w-full ${getStatusColor(selectedContact.status)}`}>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="new">New</SelectItem>
                                                                    <SelectItem value="read">Read</SelectItem>
                                                                    <SelectItem value="replied">Replied</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                                                    <p className="text-gray-900 dark:text-white">{selectedContact.email}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Message</label>
                                                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{selectedContact.message}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Received</label>
                                                    <p className="text-gray-900 dark:text-white">
                                                        {new Date(selectedContact.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() => window.location.href = `mailto:${selectedContact.email}`}
                                                        className="bg-[#3B0764] hover:bg-[#3B0764]"
                                                    >
                                                        <Mail className="h-4 w-4 mr-2" />
                                                        Reply via Email
                                                    </Button>
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
                                            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete this message from {contact.name}? This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => deleteContact(contact.id)}>
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
                Showing {filteredContacts.length} of {contacts.length} messages
            </div>
        </div>
    );
}
