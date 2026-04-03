import { useState, useRef, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paperclip, X } from 'lucide-react';
import { createTicket } from '../../services/ticketService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { toast } from 'react-toastify';

type Category = 'Hardware' | 'Software' | 'Network';
type Priority = 'Low' | 'Medium' | 'High';

const CreateTicketPage = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Software');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (!title.trim()) errs.title = 'Title is required';
    else if (title.trim().length < 5) errs.title = 'Title must be at least 5 characters';
    if (!description.trim()) errs.description = 'Description is required';
    else if (description.trim().length < 10) errs.description = 'Please provide more detail (min 10 characters)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.size > 5 * 1024 * 1024) {
      toast.error('File must be under 5 MB');
      return;
    }
    setFile(selected);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('priority', priority);
      if (file) formData.append('attachment', file);

      const ticket = await createTicket(formData);
      toast.success('Ticket submitted successfully!');
      navigate(`/tickets/${ticket._id}`);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message || 'Failed to create ticket';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Submit a Ticket</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Describe your issue and our support team will get back to you.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Input
            id="title"
            label="Issue Title"
            type="text"
            placeholder="e.g. My laptop won't connect to the VPN"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            maxLength={200}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-text-primary">
              Description
            </label>
            <textarea
              id="description"
              rows={5}
              placeholder="Describe the issue in detail — what happened, what you expected, any error messages..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={5000}
              className={`w-full px-3 py-2.5 rounded-lg border text-sm resize-none outline-none transition-colors
                ${errors.description
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                  : 'border-border focus:border-primary focus:ring-2 focus:ring-primary-light'
                }`}
            />
            {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-white transition-colors"
              >
                <option>Hardware</option>
                <option>Software</option>
                <option>Network</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-white transition-colors"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          {/* File upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Attachment (optional)</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-3 px-3 py-3 border border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
            >
              <Paperclip size={16} className="text-text-secondary" />
              <span className="text-sm text-text-secondary flex-1">
                {file ? file.name : 'Click to attach image or PDF (max 5 MB)'}
              </span>
              {file && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                  className="p-0.5 rounded text-text-secondary hover:text-rose-500 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="submit" isLoading={isLoading}>
              Submit Ticket
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate('/tickets')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateTicketPage;
