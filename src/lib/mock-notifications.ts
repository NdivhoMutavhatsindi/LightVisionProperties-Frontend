import { Bell, User, Zap, AlertTriangle } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

export type NotifKind = 'inquiry' | 'lead' | 'system' | 'task';
export type Notification = {
  id: string;
  title: string;
  message: string;
  kind: NotifKind;
  unread: boolean;
  client?: string;
  time?: string;
  assignedTo?: string | null;
};

type KindMeta = {
  label: string;
  color: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const kindMeta: Record<NotifKind, KindMeta> = {
  inquiry: { label: 'Inquiry', color: 'bg-blue-100 text-blue-700', icon: Bell },
  lead: { label: 'Lead', color: 'bg-amber-100 text-amber-700', icon: User },
  system: { label: 'System', color: 'bg-rose-100 text-rose-700', icon: AlertTriangle },
  task: { label: 'Task', color: 'bg-emerald-100 text-emerald-700', icon: Zap },
};

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'New property inquiry',
    message: 'Client requested a viewing for Luxury Sandton Residence.',
    kind: 'inquiry',
    unread: true,
    client: 'S. Khumalo',
    time: '10m ago',
    assignedTo: null,
  },
  {
    id: 'n2',
    title: 'High-value lead matched',
    message: 'A new lead matches the luxury portfolio. Please follow up.',
    kind: 'lead',
    unread: true,
    client: 'P. van der Merwe',
    time: '1h ago',
    assignedTo: null,
  },
  {
    id: 'n3',
    title: 'Background jobs finished',
    message: 'Daily import completed with 12 new listings.',
    kind: 'system',
    unread: false,
    client: 'System',
    time: '3h ago',
    assignedTo: null,
  },
  {
    id: 'n4',
    title: 'Follow up required',
    message: 'Contact client to close the offer on Cape Town Seafront Apartment.',
    kind: 'task',
    unread: true,
    client: 'A. Patel',
    time: 'Yesterday',
    assignedTo: null,
  },
];
