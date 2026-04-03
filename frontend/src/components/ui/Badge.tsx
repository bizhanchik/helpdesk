type BadgeVariant = 'status' | 'priority' | 'category' | 'role';

interface BadgeProps {
  value: string;
  variant?: BadgeVariant;
}

/** Color mapping for ticket statuses */
const statusStyles: Record<string, string> = {
  'New':         'bg-blue-50 text-blue-700',
  'In Progress': 'bg-amber-50 text-amber-700',
  'Resolved':    'bg-green-50 text-green-700',
  'Closed':      'bg-slate-100 text-slate-600',
};

/** Color mapping for ticket priorities */
const priorityStyles: Record<string, string> = {
  'Low':    'bg-green-50 text-green-700',
  'Medium': 'bg-amber-50 text-amber-700',
  'High':   'bg-rose-50 text-rose-700',
};

/** Color mapping for ticket categories */
const categoryStyles: Record<string, string> = {
  'Hardware': 'bg-blue-50 text-blue-800',
  'Software': 'bg-sky-50 text-sky-700',
  'Network':  'bg-cyan-50 text-cyan-700',
};

/** Color mapping for user roles */
const roleStyles: Record<string, string> = {
  'client': 'bg-slate-100 text-slate-600',
  'agent':  'bg-blue-50 text-blue-800',
  'admin':  'bg-rose-50 text-rose-700',
};

const getStyle = (variant: BadgeVariant, value: string): string => {
  const map = { status: statusStyles, priority: priorityStyles, category: categoryStyles, role: roleStyles };
  return map[variant]?.[value] ?? 'bg-gray-100 text-gray-600';
};

/** Colored pill badge for statuses, priorities, categories, and roles */
const Badge = ({ value, variant = 'status' }: BadgeProps) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStyle(variant, value)}`}>
      {value}
    </span>
  );
};

export default Badge;
