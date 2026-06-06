import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Users, FileText, FileSpreadsheet, CheckSquare,
  ShoppingCart, Receipt, BarChart3, Moon, Sun, Bell, Search,
  LogOut, ChevronDown, X, User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/theme";
import { useAuth } from "@/context/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Vendors", href: "/vendors", icon: Users },
  { name: "RFQs", href: "/rfqs", icon: FileText },
  { name: "Quotations", href: "/quotations", icon: FileSpreadsheet },
  { name: "Approvals", href: "/approvals", icon: CheckSquare },
  { name: "Purchase Orders", href: "/purchase-orders", icon: ShoppingCart },
  { name: "Invoices", href: "/invoices", icon: Receipt },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, title: "Approval required", desc: "Cloud Migration PO needs your approval", time: "2m ago", unread: true, type: "warning" },
  { id: 2, title: "Invoice overdue", desc: "INV-0005 from ProServices Group is overdue", time: "1h ago", unread: true, type: "danger" },
  { id: 3, title: "New quotation received", desc: "TechCore submitted a quote for Q3 Laptops", time: "3h ago", unread: true, type: "info" },
  { id: 4, title: "PO delivered", desc: "PO-0003 marked as delivered by FastShip", time: "1d ago", unread: false, type: "success" },
  { id: 5, title: "Vendor rating updated", desc: "BuildParts Manufacturing rating changed to 3.9", time: "2d ago", unread: false, type: "info" },
];

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const notifsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useClickOutside(notifsRef, () => setShowNotifs(false));
  useClickOutside(profileRef, () => setShowProfile(false));

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => setNotifications((ns) => ns.map((n) => ({ ...n, unread: false })));
  const dismiss = (id: number) => setNotifications((ns) => ns.filter((n) => n.id !== id));

  const notifDot = {
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-blue-500",
    success: "bg-emerald-500",
  };

  const currentPage = navigation.find((n) => n.href === location)?.name || "VendorBridge";

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <div className="w-64 shrink-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-2.5 border-b border-sidebar-border/50">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm">
            VB
          </div>
          <div>
            <span className="font-semibold text-base tracking-tight block leading-tight">VendorBridge</span>
            <span className="text-[10px] text-sidebar-foreground/40 uppercase tracking-widest">Procurement ERP</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}>
                  <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "opacity-100" : "opacity-70")} />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border/50">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
              {user?.avatar || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate">{user?.name}</p>
              <p className="text-[11px] text-sidebar-foreground/50 truncate">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b bg-card/80 backdrop-blur-sm flex items-center px-6 gap-4 shrink-0 sticky top-0 z-30">
          <h1 className="text-base font-semibold hidden md:block shrink-0">{currentPage}</h1>

          {/* Search */}
          <div className="flex-1 max-w-sm relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search across procurement..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm bg-muted/50 border-transparent focus:border-input focus:bg-background"
            />
          </div>

          <div className="ml-auto flex items-center gap-1">
            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Notifications */}
            <div className="relative" ref={notifsRef}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground relative"
                onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>

              {showNotifs && (
                <div className="absolute right-0 top-10 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <button className="text-xs text-primary hover:underline" onClick={markAllRead}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-border">
                    {notifications.map((n) => (
                      <div key={n.id} className={cn("flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors", n.unread && "bg-primary/5")}>
                        <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", notifDot[n.type as keyof typeof notifDot])} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold">{n.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{n.desc}</p>
                          <p className="text-[10px] text-muted-foreground/60 mt-0.5">{n.time}</p>
                        </div>
                        <button className="text-muted-foreground hover:text-foreground shrink-0" onClick={() => dismiss(n.id)}>
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div className="py-8 text-center text-sm text-muted-foreground">No notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted transition-colors h-8"
              >
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold">
                  {user?.avatar || "U"}
                </div>
                <span className="text-sm font-medium hidden sm:block max-w-[120px] truncate">{user?.name}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>

              {showProfile && (
                <div className="absolute right-0 top-10 w-56 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b bg-muted/30">
                    <p className="text-sm font-semibold truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    <Badge variant="secondary" className="mt-1 text-[10px]">{user?.role}</Badge>
                  </div>
                  <div className="p-1">
                    <button className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                      <User className="w-4 h-4" />
                      My Profile
                    </button>
                    <button
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground"
                      onClick={logout}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
