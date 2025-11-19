import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, ExternalLink } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface Partner {
    id: string;
    name: string;
    logo: string;
    website_url: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
}

export default function PartnershipManagement() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        logo: '',
        website_url: '',
        display_order: 0,
        is_active: true,
    });

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            const { data, error } = await supabase
                .from('partners')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            setPartners(data || []);
        } catch (error) {
            console.error('Error fetching partners:', error);
            toast.error('Failed to load partners');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image size must be less than 2MB');
            return;
        }

        setUploading(true);
        try {
            // Compress and resize image before converting to base64
            const compressedImage = await compressImage(file, 800, 800, 0.8);
            setFormData({ ...formData, logo: compressedImage });
            toast.success('Logo uploaded successfully');
            setUploading(false);
        } catch (error) {
            console.error('Error uploading logo:', error);
            toast.error('Failed to upload logo');
            setUploading(false);
        }
    };

    // Compress image to reduce size
    const compressImage = (file: File, maxWidth: number, maxHeight: number, quality: number): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions while maintaining aspect ratio
                    if (width > height) {
                        if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = (width * maxHeight) / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Failed to get canvas context'));
                        return;
                    }

                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to base64 with compression
                    const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                    resolve(compressedBase64);
                };
                img.onerror = () => reject(new Error('Failed to load image'));
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.logo) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            if (editingPartner) {
                const { error } = await supabase
                    .from('partners')
                    .update({
                        name: formData.name,
                        logo: formData.logo,
                        website_url: formData.website_url || null,
                        display_order: formData.display_order,
                        is_active: formData.is_active,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', editingPartner.id);

                if (error) throw error;
                toast.success('Partner updated successfully');
            } else {
                const { error } = await supabase
                    .from('partners')
                    .insert([{
                        name: formData.name,
                        logo: formData.logo,
                        website_url: formData.website_url || null,
                        display_order: formData.display_order,
                        is_active: formData.is_active,
                    }]);

                if (error) throw error;
                toast.success('Partner added successfully');
            }

            resetForm();
            fetchPartners();
        } catch (error) {
            console.error('Error saving partner:', error);
            toast.error('Failed to save partner');
        }
    };

    const handleEdit = (partner: Partner) => {
        setEditingPartner(partner);
        setFormData({
            name: partner.name,
            logo: partner.logo,
            website_url: partner.website_url || '',
            display_order: partner.display_order,
            is_active: partner.is_active,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this partner?')) return;

        try {
            const { error } = await supabase
                .from('partners')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('Partner deleted successfully');
            fetchPartners();
        } catch (error) {
            console.error('Error deleting partner:', error);
            toast.error('Failed to delete partner');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            logo: '',
            website_url: '',
            display_order: 0,
            is_active: true,
        });
        setEditingPartner(null);
        setShowForm(false);
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold">Partnership Management</h1>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 w-full sm:w-auto"
                >
                    <Plus className="h-4 w-4" />
                    Add Partner
                </Button>
            </div>

            {showForm && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4">
                        {editingPartner ? 'Edit Partner' : 'Add New Partner'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Partner Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3B0764] dark:bg-gray-700 dark:border-gray-600"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Website URL (Optional)
                            </label>
                            <input
                                type="url"
                                value={formData.website_url}
                                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                                placeholder="https://example.com"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3B0764] dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Display Order
                            </label>
                            <input
                                type="number"
                                value={formData.display_order}
                                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3B0764] dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Logo Image *
                            </label>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="logo-upload"
                                />
                                <label
                                    htmlFor="logo-upload"
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 w-full sm:w-auto"
                                >
                                    <Upload className="h-4 w-4" />
                                    {uploading ? 'Uploading...' : 'Upload Logo'}
                                </label>
                                {formData.logo && (
                                    <img
                                        src={formData.logo}
                                        alt="Logo preview"
                                        className="h-16 w-16 object-contain border rounded"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <label htmlFor="is_active" className="text-sm font-medium">
                                Active
                            </label>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button type="submit" disabled={uploading || !formData.logo} className="w-full sm:w-auto">
                                {editingPartner ? 'Update Partner' : 'Add Partner'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={resetForm}
                                className="w-full sm:w-auto"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Logo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Website
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Order
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {partners.map((partner) => (
                                <tr key={partner.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img
                                            src={partner.logo}
                                            alt={partner.name}
                                            className="h-12 w-12 object-contain"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium">{partner.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {partner.website_url ? (
                                            <a
                                                href={partner.website_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#3B0764] hover:underline flex items-center gap-1"
                                            >
                                                Visit <ExternalLink className="h-3 w-3" />
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm">{partner.display_order}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${partner.is_active
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            {partner.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(partner)}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(partner.id)}
                                                className="text-red-600 hover:text-red-800 dark:text-red-400"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {partners.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No partners found. Add your first partner to get started.
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
                {partners.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center text-gray-500">
                        No partners found. Add your first partner to get started.
                    </div>
                ) : (
                    partners.map((partner) => (
                        <div key={partner.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                            <div className="flex items-start gap-4">
                                <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="h-16 w-16 object-contain flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-lg mb-1 truncate">{partner.name}</h3>
                                    <div className="space-y-2 text-sm">
                                        {partner.website_url && (
                                            <a
                                                href={partner.website_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#3B0764] hover:underline flex items-center gap-1"
                                            >
                                                Visit Website <ExternalLink className="h-3 w-3" />
                                            </a>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500">Order:</span>
                                            <span>{partner.display_order}</span>
                                        </div>
                                        <div>
                                            <span
                                                className={`inline-block px-2 py-1 text-xs rounded-full ${partner.is_active
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                    }`}
                                            >
                                                {partner.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => handleEdit(partner)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(partner.id)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
