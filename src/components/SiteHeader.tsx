import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSession } from "@/hooks/use-session";
import { PROGRAMS } from "@/lib/site";

const NAV = [
  { to: "/about", label: "About" },
  { to: "/stories", label: "Impact & Stories" },
  { to: "/gallery", label: "Gallery" },
  { to: "/events", label: "Events" },
  { to: "/blog", label: "Blog & Insights" },
  { to: "/resources", label: "Resources" },
  { to: "/volunteer", label: "Volunteer" },
  { to: "/contact", label: "Contact" },
] as const;

const linkCls = "font-label text-[13px] font-semibold text-foreground/80 hover:text-primary";

export function SiteHeader() {
  const session = useSession();
  const [open, setOpen] = useState(false);
  const memberTo = (session ? "/portal" : "/login") as "/login";
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center" aria-label="This Lady Will home">
          <img src={logo} alt="This Lady Will" width={56} height={50} className="h-11 w-auto" />
        </Link>
        <nav className="hidden items-center gap-5 xl:flex" aria-label="Main">
          <DropdownMenu>
            <DropdownMenuTrigger className={`${linkCls} inline-flex items-center gap-1`}>
              Programs <ChevronDown className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild><Link to="/programs">All programs</Link></DropdownMenuItem>
              {PROGRAMS.map((p) => (
                <DropdownMenuItem key={p.slug} asChild>
                  <Link to="/programs" hash={p.slug}>{p.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className={linkCls} activeProps={{ className: "text-primary" }}>{n.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline" className="hidden rounded-full border-primary/30 text-primary sm:inline-flex">
            <Link to={memberTo}>{session ? "Member Area" : "Login / Member Area"}</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full bg-gold text-gold-foreground hover:bg-gold/90">
            <Link to="/apply">Join the Cohort</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="xl:hidden" aria-label="Open menu"><Menu /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 overflow-y-auto">
              <SheetTitle className="font-display text-2xl text-primary">Menu</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile">
                <Link to="/programs" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-label font-semibold hover:bg-secondary">Programs</Link>
                {PROGRAMS.map((p) => (
                  <Link key={p.slug} to="/programs" hash={p.slug} onClick={() => setOpen(false)} className="rounded-lg px-6 py-2 text-sm hover:bg-secondary">{p.name}</Link>
                ))}
                {[...NAV, { to: "/donate", label: "Donate" }, { to: memberTo, label: "Login / Member Area" }].map((n) => (
                  <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-label font-semibold hover:bg-secondary">{n.label}</Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
