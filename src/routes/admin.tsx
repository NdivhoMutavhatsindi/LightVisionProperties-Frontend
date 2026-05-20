import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useCallback, type DragEvent, type FormEvent, type ReactNode } from "react";
import { AdminHeader } from "@/components/site/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  Plus,
  Users,
  Briefcase,
  Bell,
  LogOut,
  Pencil,
  Trash2,
  Star,
  TrendingUp,
  UserCheck,
  Activity,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { io } from "socket.io-client";
import { kindMeta, type Notification, type NotifKind } from "@/lib/mock-notifications";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Light Vision Property" },
      { name: "description", content: "Manage agents, careers and notifications." },
    ],
  }),
  component: AdminDashboard,
});

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "on-leave" | "inactive";
  rating: number;
  assigned: number;
  followUps: number;
  closed: number;
  profileImage?: string | null;
}

interface Job {
  id: string;
  title: string;
  location: string;
  type: string;
  description: string;
  status: "open" | "closed";
  applicants: number;
  postedAt: string;
}

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  status: "available" | "under offer" | "sold";
  description: string;
  image?: string | null;
  postedAt: string;
}

interface ValuationRequest {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  propertyAddress: string;
  propertyType: string;
  estimatedSize?: string;
  notes?: string;
  status: "pending" | "contacted" | "completed";
  createdAt: string;
}

interface AdminNotif extends Notification {
  assignedTo?: string;
}

function ImageDropZone({
  label,
  file,
  onFileChange,
}: {
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
}) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const droppedFile = event.dataTransfer.files?.[0] ?? null;
    if (droppedFile) {
      onFileChange(droppedFile);
    }
  };

  return (
    <div>
      <Label>{label}</Label>
      <div
        className={`relative min-h-[220px] rounded-[28px] border-2 ${dragActive ? "border-gold bg-gold/10" : "border-navy/10 bg-slate-50"} p-8 text-center transition-all duration-200 shadow-[0_25px_80px_-40px_rgba(0,0,0,0.35)]`}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragActive(false);
        }}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="rounded-full bg-navy/10 p-4 inline-flex">
            <Plus className="size-5 text-navy" />
          </div>
          <div>
            <p className="text-base font-semibold text-navy">Drag & drop an image here</p>
            <p className="text-sm text-navy/60">or click to browse from your device</p>
          </div>
          {file ? (
            <div className="mt-3 rounded-2xl border border-navy/10 bg-navy/5 px-4 py-2 text-sm text-navy">
              {file.name}
            </div>
          ) : (
            <p className="text-sm text-navy/60">Recommended size: 1200×800px • JPG, PNG or WEBP</p>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          aria-label={`Upload ${label}`}
          className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
          onChange={(event) => onFileChange(event.target.files ? event.target.files[0] : null)}
        />
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [valuations, setValuations] = useState<ValuationRequest[]>([]);
  const [notifs, setNotifs] = useState<AdminNotif[]>([]);
  const [dbInfo, setDbInfo] = useState<{ database?: string; userCounts?: { role: string; count: number }[]; tables?: string[] }>({});
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | NotifKind>("all");
  const [agentForm, setAgentForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [agentImage, setAgentImage] = useState<File | null>(null);
  const [jobForm, setJobForm] = useState({ title: "", location: "", type: "Full-time", description: "" });
  const [propertyForm, setPropertyForm] = useState({ title: "", location: "", price: "", status: "available", description: "" });
  const [propertyImage, setPropertyImage] = useState<File | null>(null);
  const [editAgent, setEditAgent] = useState<Agent | null>(null);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [editProperty, setEditProperty] = useState<Property | null>(null);

  const normalizeAgent = (agent: any): Agent => ({
    id: String(agent.id),
    name: agent.name ?? "Unknown agent",
    email: agent.email ?? "",
    phone: agent.phone ?? "",
    status: agent.status === "inactive" ? "inactive" : "active",
    profileImage: agent.profileImage ?? agent.image ?? null,
    rating: Math.min(5, Math.max(3, 3 + (Number(agent.listingsCount) || 0) / 5)),
    assigned: Number(agent.assigned) || 0,
    followUps: Number(agent.followUps) || 0,
    closed: Number(agent.closed) || 0,
  });

  const normalizeProperty = (property: any): Property => ({
    id: String(property.id),
    title: property.title ?? property.address ?? "Untitled listing",
    location: property.location ?? property.address ?? "Unknown location",
    price:
      typeof property.price === "number"
        ? `R ${property.price.toLocaleString()}`
        : property.price ?? "Contact for price",
    status: property.status ?? "available",
    description: property.description ?? "",
    image: property.main_image ?? property.image ?? null,
    postedAt: property.created_at
      ? new Date(property.created_at).toLocaleDateString()
      : property.postedAt ?? "Today",
  });

  const loadDashboardData = useCallback(async () => {
    try {
      setFetchError(null);
      const [dashboardRes, propertiesRes, agentsRes, valuationsRes] = await Promise.all([
        api.get("/api/dashboard"),
        api.get("/api/properties"),
        api.get("/api/agents"),
        api.get("/api/valuations"),
      ]);

      setDbInfo(dashboardRes.data || {});
      setProperties((Array.isArray(propertiesRes.data) ? propertiesRes.data : []).map(normalizeProperty));
      setAgents((Array.isArray(agentsRes.data) ? agentsRes.data : []).map(normalizeAgent));
      setValuations(Array.isArray(valuationsRes.data) ? valuationsRes.data : []);
    } catch (error: any) {
      console.error("Admin dashboard load error:", error);
      if (error?.response?.status === 429) {
        setFetchError("Too many requests. Please wait a moment and try again.");
      } else {
        setFetchError(error?.response?.data?.message ?? error?.message ?? "Unable to load admin data.");
      }
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    loadDashboardData();
    const interval = window.setInterval(() => {
      if (!mounted) return;
      loadDashboardData();
    }, 15000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [loadDashboardData]);

  useEffect(() => {
      const socketUrl = import.meta.env.DEV
        ? "http://localhost:5000"
        : import.meta.env.VITE_API_BASE_URL ?? window.location.origin;
      const socket = io(socketUrl, { transports: ["websocket"], withCredentials: true });
    socket.on("propertiesUpdated", () => {
      loadDashboardData();
    });

    socket.on("valuationsUpdated", () => {
      loadDashboardData();
    });

    return () => {
      socket.disconnect();
    };
  }, [loadDashboardData]);

  const filtered = useMemo(
    () => (filter === "all" ? notifs : notifs.filter((n) => n.kind === filter)),
    [notifs, filter],
  );
  const unreadCount = notifs.filter((n) => n.unread).length;
  const openJobs = jobs.filter((j) => j.status === "open").length;
  const activeAgents = useMemo(() => {
    return (agents.length || dbInfo.userCounts?.find((u) => u.role === "agent")?.count) ?? 0;
  }, [agents, dbInfo]);
  const totalApplicants = jobs.reduce((sum, job) => sum + job.applicants, 0);
  const availableProperties = properties.filter((property) => property.status === "available").length;

  const markRead = (id: string) => setNotifs((previous) => previous.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  const assignNotif = (id: string, agentId: string) => {
    setNotifs((previous) => previous.map((n) => (n.id === id ? { ...n, assignedTo: agentId, unread: false } : n)));
    setAgents((previous) => previous.map((agent) => (agent.id === agentId ? { ...agent, assigned: agent.assigned + 1 } : agent)));
    const assigned = agents.find((agent) => agent.id === agentId);
    toast.success(`Assigned to ${assigned?.name}`);
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const uploadRes = await api.post('/api/media/upload', formData);
    return uploadRes.data.url as string;
  };

  const addAgent = async (event: FormEvent) => {
    event.preventDefault();
    if (!agentForm.name || !agentForm.email || !agentForm.password) return toast.error("Name, email, and password required");
    if (!agentImage) return toast.error("Agent image is required");

    try {
      const profileImageUrl = await uploadFile(agentImage);
      const res = await api.post('/api/auth/register', {
        name: agentForm.name,
        email: agentForm.email,
        password: agentForm.password,
        phone: agentForm.phone,
        role: 'agent',
        profileImage: profileImageUrl,
      });
      const user = res.data.user;
      setAgents((previous) => [
        {
          id: String(user.id),
          name: user.name,
          email: user.email,
          phone: agentForm.phone,
          profileImage: profileImageUrl,
          status: 'active',
          rating: 4.2,
          assigned: 0,
          followUps: 0,
          closed: 0,
        },
        ...previous,
      ]);
      setAgentForm({ name: '', email: '', phone: '', password: '' });
      setAgentImage(null);
      await loadDashboardData();
      toast.success('Agent account created');
    } catch (e) {
      toast.error('Agent creation failed');
    }
  };

  const deleteAgent = (id: string) => {
    setAgents((previous) => previous.filter((agent) => agent.id !== id));
    toast.success("Agent removed");
  };

  const saveAgent = () => {
    if (!editAgent) return;
    setAgents((previous) => previous.map((agent) => (agent.id === editAgent.id ? editAgent : agent)));
    setEditAgent(null);
    toast.success("Agent updated");
  };

  const addJob = (event: FormEvent) => {
    event.preventDefault();
    if (!jobForm.title || !jobForm.location) return toast.error("Title and location required");
    setJobs((previous) => [
      {
        id: crypto.randomUUID(),
        ...jobForm,
        status: "open",
        applicants: 0,
        postedAt: "just now",
      },
      ...previous,
    ]);
    setJobForm({ title: "", location: "", type: "Full-time", description: "" });
    toast.success("Job posted to careers page");
  };

  const deleteJob = (id: string) => {
    setJobs((previous) => previous.filter((job) => job.id !== id));
    toast.success("Job removed");
  };

  const toggleJobStatus = (id: string) => {
    setJobs((previous) => previous.map((job) => (job.id === id ? { ...job, status: job.status === "open" ? "closed" : "open" } : job)));
  };

  const saveJob = () => {
    if (!editJob) return;
    setJobs((previous) => previous.map((job) => (job.id === editJob.id ? editJob : job)));
    setEditJob(null);
    toast.success("Job updated");
  };

  const addProperty = async (event: FormEvent) => {
    event.preventDefault();
    if (!propertyForm.title || !propertyForm.location || !propertyForm.price) return toast.error("Title, location and price required");
    if (!propertyImage) return toast.error("Property image is required");

    try {
      const imageUrl = await uploadFile(propertyImage);
      await api.post('/api/properties', {
        title: propertyForm.title,
        location: propertyForm.location,
        price: propertyForm.price,
        description: propertyForm.description,
        status: propertyForm.status,
        main_image: imageUrl,
      });
      setPropertyForm({ title: '', location: '', price: '', status: 'available', description: '' });
      setPropertyImage(null);
      await loadDashboardData();
      toast.success('Property listed successfully');
    } catch (e) {
      toast.error('Property creation failed');
    }
  };

  const deleteProperty = (id: string) => {
    setProperties((previous) => previous.filter((property) => property.id !== id));
    toast.success("Property removed");
  };

  const togglePropertyStatus = (id: string) => {
    setProperties((previous) =>
      previous.map((property) =>
        property.id === id
          ? {
              ...property,
              status: property.status === "available" ? "under offer" : property.status === "under offer" ? "sold" : "available",
            }
          : property,
      ),
    );
  };

  const saveProperty = () => {
    if (!editProperty) return;
    setProperties((previous) => previous.map((property) => (property.id === editProperty.id ? editProperty : property)));
    setEditProperty(null);
    toast.success("Property updated");
  };

  const topAgent = [...agents].sort((a, b) => b.followUps - a.followUps)[0];

  return (
    <div className="min-h-screen bg-white text-charcoal">
      <AdminHeader />
      <main className="pt-40">
        <section className="mx-auto max-w-7xl px-6 py-12">
          {fetchError ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
              <h2 className="text-xl font-semibold">Unable to load admin dashboard</h2>
              <p className="mt-2 text-sm">{fetchError}</p>
              <p className="mt-2 text-sm text-navy/70">
                Check your database connection and make sure the backend is running against the correct database.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard icon={<Bell className="size-5" />} label="Unread" value={unreadCount} />
          <StatCard icon={<UserCheck className="size-5" />} label="Active Agents" value={activeAgents} />
          <StatCard icon={<Briefcase className="size-5" />} label="Open Jobs" value={openJobs} />
          <StatCard icon={<Users className="size-5" />} label="Available Properties" value={availableProperties} />
          <StatCard icon={<FileText className="size-5" />} label="Valuation Requests" value={valuations.length} />
        </div>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="mb-6 flex-wrap h-auto">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="valuations">Valuations</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="jobs">Careers</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
            <div className="flex flex-wrap gap-2 mb-4">
              <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>All</FilterChip>
              {(Object.keys(kindMeta) as NotifKind[]).map((kind) => (
                <FilterChip key={kind} active={filter === kind} onClick={() => setFilter(kind)}>{kindMeta[kind].label}</FilterChip>
              ))}
            </div>
            <div className="space-y-3">
              {filtered.map((notification) => {
                const meta = kindMeta[notification.kind];
                const assigned = agents.find((agent) => agent.id === notification.assignedTo);
                const Icon = meta.icon;
                return (
                  <Card key={notification.id} className={notification.unread ? "border-gold/40" : ""}>
                    <CardContent className="p-4 flex gap-4 items-start flex-wrap md:flex-nowrap">
                      <div className={`size-10 rounded-full grid place-items-center ${meta.color}`}>
                        <Icon className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-navy">{notification.title}</span>
                          <Badge variant="secondary" className="text-[10px]">{meta.label}</Badge>
                          {notification.unread && <span className="size-2 rounded-full bg-gold" />}
                          {assigned && (
                            <Badge className="text-[10px] bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                              Assigned: {assigned.name}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-navy/70 mt-1">{notification.message}</div>
                        <div className="text-xs text-navy/50 mt-1">{notification.client} • {notification.time}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={notification.assignedTo ?? ""} onValueChange={(value) => assignNotif(notification.id, value)}>
                          <SelectTrigger className="h-9 w-40 text-xs">
                            <SelectValue placeholder="Assign agent" />
                          </SelectTrigger>
                          <SelectContent>
                            {agents.filter((agent) => agent.status === "active").map((agent) => (
                              <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {notification.unread && (
                          <Button size="sm" variant="ghost" onClick={() => markRead(notification.id)}>Mark read</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {filtered.length === 0 && <p className="text-navy/50 text-sm">No notifications.</p>}
            </div>
          </TabsContent>

          <TabsContent value="valuations">
            <div className="space-y-4">
              {valuations.length === 0 ? (
                <p className="text-sm text-navy/50">No valuation requests received yet.</p>
              ) : (
                valuations.map((valuation) => (
                  <Card key={valuation.id}>
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Valuation request</p>
                          <p className="text-xl font-semibold text-navy">{valuation.fullName}</p>
                          <p className="text-sm text-navy/70">{valuation.email} · {valuation.phone ?? "No phone"}</p>
                        </div>
                        <Badge className="rounded-full bg-slate-100 text-slate-700">{valuation.status}</Badge>
                      </div>
                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Address</p>
                          <p className="text-sm text-navy/80">{valuation.propertyAddress}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Property type</p>
                          <p className="text-sm text-navy/80">{valuation.propertyType}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Estimated value</p>
                          <p className="text-sm text-navy/80">{valuation.estimatedSize || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Submitted</p>
                          <p className="text-sm text-navy/80">{new Date(valuation.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      {valuation.notes ? (
                        <div className="mt-5">
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Notes</p>
                          <p className="mt-2 text-sm text-navy/80">{valuation.notes}</p>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="agents">
            <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><Plus className="size-4" /> Create Agent</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={addAgent} className="space-y-3">
                    <div>
                      <Label>Full name</Label>
                      <Input value={agentForm.name} onChange={(event) => setAgentForm({ ...agentForm, name: event.target.value })} />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input type="email" value={agentForm.email} onChange={(event) => setAgentForm({ ...agentForm, email: event.target.value })} />
                    </div>
                    <div>
                      <Label>Password</Label>
                      <Input type="password" value={agentForm.password} onChange={(event) => setAgentForm({ ...agentForm, password: event.target.value })} />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input value={agentForm.phone} onChange={(event) => setAgentForm({ ...agentForm, phone: event.target.value })} />
                    </div>
                    <ImageDropZone label="Profile image" file={agentImage} onFileChange={setAgentImage} />
                    <Button type="submit" className="w-full bg-navy hover:bg-navy/90">Create account</Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Team ({agents.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {agents.map((agent) => (
                    <div key={agent.id} className="border border-navy/10 rounded-lg p-3 flex items-center gap-3 flex-wrap">
                      {agent.profileImage ? (
                        <img
                          src={agent.profileImage}
                          alt={agent.name}
                          className="size-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="size-10 rounded-full bg-navy/10 grid place-items-center font-medium text-navy">
                          {agent.name.split(" ").map((segment) => segment[0]).slice(0, 2).join("")}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-navy">{agent.name}</span>
                          <Badge variant={agent.status === "active" ? "default" : "secondary"} className="text-[10px] capitalize">{agent.status}</Badge>
                          <span className="text-xs flex items-center gap-1 text-amber-600">
                            <Star className="size-3 fill-current" /> {agent.rating.toFixed(1)}
                          </span>
                        </div>
                        <div className="text-xs text-navy/60">{agent.email} • {agent.phone}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setEditAgent(agent)}><Pencil className="size-4" /></Button>
                        <Button size="icon" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => deleteAgent(agent.id)}><Trash2 className="size-4" /></Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            {topAgent && (
              <Card className="mb-6 border-gold/40 bg-gradient-to-br from-gold/5 to-transparent">
                <CardContent className="p-5 flex items-center gap-4 flex-wrap">
                  <div className="size-12 rounded-full bg-gold/20 text-gold grid place-items-center">
                    <TrendingUp className="size-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] uppercase tracking-wider text-navy/60">Top Performer</div>
                    <div className="font-display text-2xl text-navy">{topAgent.name}</div>
                    <div className="text-sm text-navy/60">{topAgent.followUps} follow-ups • {topAgent.closed} deals closed</div>
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              {agents.map((agent) => {
                const maxAssigned = Math.max(...agents.map((item) => item.assigned), 1);
                const completion = agent.assigned ? Math.round((agent.closed / agent.assigned) * 100) : 0;
                return (
                  <Card key={agent.id}>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <div>
                          <div className="font-medium text-navy">{agent.name}</div>
                          <div className="text-xs text-navy/60 capitalize">{agent.status}</div>
                        </div>
                        <div className="flex items-center gap-1 text-amber-600 text-sm">
                          <Star className="size-4 fill-current" /> {agent.rating.toFixed(1)}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                        <Metric label="Assigned" value={agent.assigned} />
                        <Metric label="Follow-ups" value={agent.followUps} />
                        <Metric label="Closed" value={agent.closed} />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-navy/60 mb-1">
                          <span>Workload</span><span>{Math.round((agent.assigned / maxAssigned) * 100)}%</span>
                        </div>
                        <Progress value={(agent.assigned / maxAssigned) * 100} className="h-2 mb-3" />
                        <div className="flex justify-between text-xs text-navy/60 mb-1">
                          <span>Close rate</span><span>{completion}%</span>
                        </div>
                        <Progress value={completion} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="jobs">
            <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><Plus className="size-4" /> Post Job</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={addJob} className="space-y-3">
                    <div>
                      <Label>Title</Label>
                      <Input value={jobForm.title} onChange={(event) => setJobForm({ ...jobForm, title: event.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Location</Label>
                        <Input value={jobForm.location} onChange={(event) => setJobForm({ ...jobForm, location: event.target.value })} />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Select value={jobForm.type} onValueChange={(value) => setJobForm({ ...jobForm, type: value })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                            <SelectItem value="Internship">Internship</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea rows={4} value={jobForm.description} onChange={(event) => setJobForm({ ...jobForm, description: event.target.value })} />
                    </div>
                    <Button type="submit" className="w-full bg-navy hover:bg-navy/90">Publish job</Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Listings ({jobs.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {jobs.map((job) => (
                    <div key={job.id} className="border border-navy/10 rounded-lg p-3">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-navy">{job.title}</span>
                            <Badge variant={job.status === "open" ? "default" : "secondary"} className="text-[10px] capitalize">{job.status}</Badge>
                          </div>
                          <div className="text-xs text-navy/60">{job.location} • {job.type} • {job.postedAt}</div>
                          {job.description && <p className="text-sm text-navy/70 mt-2">{job.description}</p>}
                          <div className="text-xs text-navy/60 mt-2 flex items-center gap-1">
                            <Activity className="size-3" /> {job.applicants} applicant{job.applicants === 1 ? "" : "s"}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="outline" onClick={() => toggleJobStatus(job.id)}>
                            {job.status === "open" ? "Close" : "Reopen"}
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => setEditJob(job)}><Pencil className="size-4" /></Button>
                          <Button size="icon" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => deleteJob(job.id)}><Trash2 className="size-4" /></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="properties">
            <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><Plus className="size-4" /> Add Property</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={addProperty} className="space-y-3">
                    <div>
                      <Label>Title</Label>
                      <Input value={propertyForm.title} onChange={(event) => setPropertyForm({ ...propertyForm, title: event.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Location</Label>
                        <Input value={propertyForm.location} onChange={(event) => setPropertyForm({ ...propertyForm, location: event.target.value })} />
                      </div>
                      <div>
                        <Label>Price</Label>
                        <Input value={propertyForm.price} onChange={(event) => setPropertyForm({ ...propertyForm, price: event.target.value })} />
                      </div>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select value={propertyForm.status} onValueChange={(value) => setPropertyForm({ ...propertyForm, status: value as Property["status"] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="under offer">Under offer</SelectItem>
                          <SelectItem value="sold">Sold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea rows={4} value={propertyForm.description} onChange={(event) => setPropertyForm({ ...propertyForm, description: event.target.value })} />
                    </div>
                    <ImageDropZone label="Main image" file={propertyImage} onFileChange={setPropertyImage} />
                    <Button type="submit" className="w-full bg-navy hover:bg-navy/90">List property</Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Inventory ({properties.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {properties.map((property) => (
                    <div key={property.id} className="border border-navy/10 rounded-lg overflow-hidden bg-white shadow-sm">
                      {property.image ? (
                        <div className="relative h-52 overflow-hidden bg-slate-100">
                          <img
                            src={property.image}
                            alt={property.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute left-4 top-4 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-semibold text-white">
                            {property.status.replace("under offer", "Under offer")}
                          </div>
                        </div>
                      ) : null}
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-navy">{property.title}</span>
                              {!property.image && (
                                <Badge variant={property.status === "available" ? "default" : property.status === "under offer" ? "secondary" : "outline"} className="text-[10px] capitalize">
                                  {property.status}
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-navy/60">{property.location} • {property.postedAt}</div>
                            <p className="text-sm text-navy/70 mt-2">{property.description}</p>
                            <div className="text-xs text-navy/60 mt-2">{property.price}</div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="outline" onClick={() => togglePropertyStatus(property.id)}>
                              {property.status === "sold" ? "Mark available" : property.status === "under offer" ? "Mark sold" : "Mark under offer"}
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => setEditProperty(property)}><Pencil className="size-4" /></Button>
                            <Button size="icon" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => deleteProperty(property.id)}><Trash2 className="size-4" /></Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={!!editAgent} onOpenChange={(open) => !open && setEditAgent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Agent</DialogTitle>
              <DialogDescription>Update agent details and status.</DialogDescription>
            </DialogHeader>
            {editAgent && (
              <div className="space-y-3">
                <div>
                  <Label>Name</Label>
                  <Input value={editAgent.name} onChange={(event) => setEditAgent({ ...editAgent, name: event.target.value })} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={editAgent.email} onChange={(event) => setEditAgent({ ...editAgent, email: event.target.value })} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={editAgent.phone} onChange={(event) => setEditAgent({ ...editAgent, phone: event.target.value })} />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={editAgent.status} onValueChange={(value) => setEditAgent({ ...editAgent, status: value as Agent["status"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on-leave">On leave</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Rating (0–5)</Label>
                  <Input type="number" step="0.1" min={0} max={5} value={editAgent.rating} onChange={(event) => setEditAgent({ ...editAgent, rating: Number(event.target.value) })} />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditAgent(null)}>Cancel</Button>
              <Button className="bg-navy hover:bg-navy/90" onClick={saveAgent}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!editJob} onOpenChange={(open) => !open && setEditJob(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Job</DialogTitle>
              <DialogDescription>Update the job listing.</DialogDescription>
            </DialogHeader>
            {editJob && (
              <div className="space-y-3">
                <div>
                  <Label>Title</Label>
                  <Input value={editJob.title} onChange={(event) => setEditJob({ ...editJob, title: event.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Location</Label>
                    <Input value={editJob.location} onChange={(event) => setEditJob({ ...editJob, location: event.target.value })} />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Input value={editJob.type} onChange={(event) => setEditJob({ ...editJob, type: event.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea rows={4} value={editJob.description} onChange={(event) => setEditJob({ ...editJob, description: event.target.value })} />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditJob(null)}>Cancel</Button>
              <Button className="bg-navy hover:bg-navy/90" onClick={saveJob}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!editProperty} onOpenChange={(open) => !open && setEditProperty(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Property</DialogTitle>
              <DialogDescription>Update the property listing.</DialogDescription>
            </DialogHeader>
            {editProperty && (
              <div className="space-y-3">
                <div>
                  <Label>Title</Label>
                  <Input value={editProperty.title} onChange={(event) => setEditProperty({ ...editProperty, title: event.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Location</Label>
                    <Input value={editProperty.location} onChange={(event) => setEditProperty({ ...editProperty, location: event.target.value })} />
                  </div>
                  <div>
                    <Label>Price</Label>
                    <Input value={editProperty.price} onChange={(event) => setEditProperty({ ...editProperty, price: event.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={editProperty.status} onValueChange={(value) => setEditProperty({ ...editProperty, status: value as Property["status"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="under offer">Under offer</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea rows={4} value={editProperty.description} onChange={(event) => setEditProperty({ ...editProperty, description: event.target.value })} />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditProperty(null)}>Cancel</Button>
              <Button className="bg-navy hover:bg-navy/90" onClick={saveProperty}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>) }
        </section>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-3 text-navy/60 text-xs uppercase tracking-wider">{icon}{label}</div>
        <div className="font-display text-3xl text-navy mt-2">{value}</div>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-navy/5 p-2">
      <div className="font-display text-xl text-navy">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-navy/60">{label}</div>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
        active ? "bg-navy text-white" : "bg-white border border-navy/10 text-navy/70 hover:border-navy/30"
      }`}
    >
      {children}
    </button>
  );
}
