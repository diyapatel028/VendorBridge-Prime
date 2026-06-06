import { Link } from "wouter";
import {
  Users, FileText, CheckSquare, ShoppingCart, Receipt, BarChart3,
  ArrowRight, Shield, Zap, Globe, Star, ChevronRight, Building2,
  TrendingUp, Clock, DollarSign, Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  { icon: Users, title: "Vendor Management", desc: "Centralize vendor onboarding, ratings, performance tracking, and lifecycle management in one place." },
  { icon: FileText, title: "RFQ Automation", desc: "Create and send RFQs to multiple vendors simultaneously. Manage deadlines and track responses in real time." },
  { icon: CheckSquare, title: "Approval Workflows", desc: "Multi-level approval routing with priority flags, delegation, and audit trail for every decision." },
  { icon: ShoppingCart, title: "Purchase Orders", desc: "Auto-generate POs from accepted quotes. Track delivery status, amendments, and fulfillment." },
  { icon: Receipt, title: "Invoice Tracking", desc: "Match invoices to POs, flag discrepancies, and manage payment schedules with overdue alerts." },
  { icon: BarChart3, title: "Procurement Analytics", desc: "Live dashboards with spend analysis, vendor performance scores, and cost-saving recommendations." },
];

const workflow = [
  { step: 1, label: "Vendor Registration", icon: Building2, color: "bg-blue-500" },
  { step: 2, label: "RFQ Creation", icon: FileText, color: "bg-indigo-500" },
  { step: 3, label: "Quotation Submission", icon: Package, color: "bg-violet-500" },
  { step: 4, label: "Quote Comparison", icon: TrendingUp, color: "bg-amber-500" },
  { step: 5, label: "Approval Process", icon: CheckSquare, color: "bg-orange-500" },
  { step: 6, label: "Purchase Order", icon: ShoppingCart, color: "bg-emerald-500" },
  { step: 7, label: "Invoice Tracking", icon: Receipt, color: "bg-teal-500" },
  { step: 8, label: "Reports", icon: BarChart3, color: "bg-cyan-500" },
];

const stats = [
  { value: "68%", label: "Reduction in procurement cycle time" },
  { value: "$2.4M", label: "Average annual savings per company" },
  { value: "99.9%", label: "Platform uptime SLA" },
  { value: "500+", label: "Enterprise customers worldwide" },
];

const testimonials = [
  { name: "Sarah Chen", role: "VP Procurement, TechCorp", quote: "VendorBridge cut our PO cycle from 14 days to 3. Approval workflows alone saved us thousands per month.", avatar: "SC" },
  { name: "Marcus Williams", role: "CFO, GlobalMfg Inc.", quote: "The analytics dashboard gives us visibility we never had before. We identified $800K in savings in our first quarter.", avatar: "MW" },
  { name: "Priya Sharma", role: "Procurement Director, RetailCo", quote: "Vendor onboarding used to take weeks. With VendorBridge it's done in hours. Our team loves it.", avatar: "PS" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white text-sm">VB</div>
            <span className="font-semibold text-lg tracking-tight">VendorBridge</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#workflow" className="hover:text-primary transition-colors">Workflow</a>
            <a href="#analytics" className="hover:text-primary transition-colors">Analytics</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary/90 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%23ffffff opacity=.03%3E%3Cpath d=M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-6 py-28 text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/10 px-4 py-1">
            <Star className="w-3.5 h-3.5 mr-1 fill-amber-400 text-amber-400" />
            Trusted by 500+ enterprises globally
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-none">
            Procurement<br />
            <span className="text-sky-300">Reimagined.</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            VendorBridge unifies your entire procurement operation — from vendor onboarding to invoice payment — in a single intelligent platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 h-12">
                Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12 px-8">
                Sign In to Dashboard
              </Button>
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-sky-300">{s.value}</div>
                <div className="text-sm text-white/60 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">Platform Features</Badge>
            <h2 className="text-4xl font-bold mb-4">Everything you need to manage procurement</h2>
            <p className="text-gray-500 max-w-xl mx-auto">One platform to handle the full procurement lifecycle from sourcing to payment.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Procurement Workflow */}
      <section id="workflow" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">End-to-End Process</Badge>
            <h2 className="text-4xl font-bold mb-4">Complete Procurement Workflow</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Every step of the procurement journey, automated and connected.</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-6 left-[60px] right-[60px] h-0.5 bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 opacity-30" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {workflow.map((w, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-3">
                  <div className={`w-12 h-12 rounded-full ${w.color} flex items-center justify-center shadow-lg relative z-10`}>
                    <w.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xs font-medium text-gray-700 leading-tight">{w.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits / Analytics */}
      <section id="analytics" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-white/10 text-white border-white/20 hover:bg-white/10">AI-Powered Analytics</Badge>
              <h2 className="text-4xl font-bold mb-6">Insights that drive real savings</h2>
              <div className="space-y-6">
                {[
                  { icon: TrendingUp, title: "Spend Intelligence", desc: "Identify overspend patterns and benchmark against industry rates automatically." },
                  { icon: Shield, title: "Vendor Risk Scoring", desc: "AI-powered risk ratings flag underperforming or high-risk suppliers before issues arise." },
                  { icon: DollarSign, title: "Cost Optimization", desc: "Real-time recommendations on consolidation, timing, and negotiation opportunities." },
                  { icon: Clock, title: "Cycle Time Reduction", desc: "Bottleneck detection surfaces delays in your procurement pipeline instantly." },
                ].map((b, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center shrink-0">
                      <b.icon className="w-5 h-5 text-sky-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{b.title}</h3>
                      <p className="text-sm text-white/60">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Avg. Cycle Time", value: "3.2 days", change: "-78%", positive: true },
                { label: "Cost Savings", value: "$2.4M", change: "+34%", positive: true },
                { label: "Vendor Compliance", value: "96.8%", change: "+12%", positive: true },
                { label: "PO Accuracy", value: "99.1%", change: "+8%", positive: true },
              ].map((m, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-sm text-white/50 mb-1">{m.label}</p>
                  <p className="text-2xl font-bold mb-1">{m.value}</p>
                  <p className="text-sm font-medium text-emerald-400">{m.change} vs last year</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by procurement leaders</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">{t.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-sky-500">
        <div className="max-w-3xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to transform your procurement?</h2>
          <p className="text-white/80 mb-8">Join 500+ enterprises. No credit card required.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8">
                Start Free Trial <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded bg-primary flex items-center justify-center font-bold text-white text-xs">VB</div>
                <span className="font-semibold">VendorBridge</span>
              </div>
              <p className="text-sm text-white/50">Enterprise procurement platform for modern businesses.</p>
            </div>
            {[
              { title: "Product", links: ["Features", "Workflow", "Analytics", "Pricing"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
              { title: "Support", links: ["Documentation", "Help Center", "API Reference", "Contact Us"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}><a href="#" className="text-sm text-white/50 hover:text-white transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/40">© 2026 VendorBridge. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-white/40">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
