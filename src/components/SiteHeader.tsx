import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "@/hooks/use-session";

const NAV = [
  { to: "/about", label: "About" },
  { to: "/programs", label: "Programs" },
  { to: "/events", label: "Events" },
  { to: "/stories", label: "Stories" },
] as const;

export function SiteHeader() {
  const session = useSession();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-2.5 sm:px-6 lg:flex lg:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-2" aria-label="This Lady Will home">
          <img src={logo} alt="" width={56} height={50} className="h-11 w-auto shrink-0 mix-blend-multiply" />
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="font-label text-sm font-semibold text-foreground/80 hover:text-primary" activeProps={{ className: "text-primary" }}>
              {n.label}
            </Link>
          ))}
          <Link to={session ? "/portal" : "/auth"} className="font-label text-sm font-semibold text-foreground/80 hover:text-primary">
            {session ? "Member Portal" : "Member Login"}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden rounded-full sm:inline-flex">
            <Link to="/apply">Join the Cohort</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full bg-gold text-gold-foreground hover:bg-gold/90">
            <Link to="/donate">Donate</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="font-display text-2xl text-primary">Menu</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile">
                {[...NAV, { to: "/apply", label: "Join the Cohort" }, { to: session ? "/portal" : "/auth", label: session ? "Member Portal" : "Member Login" }].map((n) => (
                  <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-label font-semibold hover:bg-secondary">
                    {n.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
