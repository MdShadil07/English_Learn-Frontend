import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { api } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Flag, AlertCircle, MessageSquare } from 'lucide-react';

interface SupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: 'general' | 'billing' | 'technical' | 'account' | 'feature';
  sourcePage?: string;
}

export function SupportTicketModal({ isOpen, onClose, defaultCategory = 'billing', sourcePage = 'pricing-page' }: SupportTicketModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: defaultCategory,
    urgency: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    message: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        name: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '',
        email: user?.email || '',
        category: defaultCategory
      }));
    }
  }, [isOpen, user, defaultCategory]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.support.submitRequest({
        ...formData,
        source: 'in-app-modal',
        pageUrl: sourcePage,
      });

      if (response && response.success) {
        toast({
          title: 'Ticket Submitted!',
          description: 'Our support team has received your request and will get back to you shortly.',
          duration: 5000,
        });
        onClose();
        setFormData(prev => ({ ...prev, subject: '', message: '' })); // clear on success
      }
    } catch (error: any) {
      toast({
        title: 'Submission Failed',
        description: error.message || 'There was an issue submitting your ticket. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="bg-gradient-to-br from-rose-500/10 via-transparent to-red-500/5 dark:from-rose-500/20 dark:to-red-500/10 p-6 pb-4">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl shadow-lg shadow-rose-500/30 flex items-center justify-center mb-4 transform rotate-3 ring-4 ring-rose-500/20">
              <Flag className="w-6 h-6 text-white -rotate-3 drop-shadow-md" />
            </div>
            <DialogTitle className="text-xl text-center font-bold text-slate-900 dark:text-white tracking-tight">Report an Issue</DialogTitle>
            <DialogDescription className="text-center text-slate-500 dark:text-slate-400 mt-1">
              Having trouble? We're here to help.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-slate-600 dark:text-slate-300">Name</Label>
              <Input
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-600 dark:text-slate-300">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 h-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-xs font-semibold text-slate-600 dark:text-slate-300">Category</Label>
              <Select value={formData.category} onValueChange={(val) => handleSelectChange('category', val)}>
                <SelectTrigger id="category" className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 h-9">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="billing">Billing & Subscriptions</SelectItem>
                  <SelectItem value="technical">Technical Support</SelectItem>
                  <SelectItem value="account">Account Recovery</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="urgency" className="text-xs font-semibold text-slate-600 dark:text-slate-300">Urgency</Label>
              <Select value={formData.urgency} onValueChange={(val) => handleSelectChange('urgency', val)}>
                <SelectTrigger id="urgency" className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 h-9">
                  <SelectValue placeholder="Select Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subject" className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> Subject
            </Label>
            <Input
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g. Upgrade issue"
              className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" /> Message
            </Label>
            <Textarea
              id="message"
              name="message"
              required
              minLength={20}
              rows={3}
              value={formData.message}
              onChange={handleChange}
              placeholder="Describe your issue..."
              className="resize-none bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="h-9 hover:bg-slate-100 dark:hover:bg-slate-800">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="h-9 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white shadow-md shadow-rose-500/20">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
                </>
              ) : (
                'Submit Ticket'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
