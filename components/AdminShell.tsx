import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { logoutAction } from "@/app/admin/actions";

const NAV = [
  { href: "/admin", label: "Dashboard", id: "dashboard" },
  { href: "/admin/leads", label: "Leads", id: "leads" },
  { href: "/admin/funil", label: "Funil", id: "funil" },
];

export async function AdminShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: string;
}) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-bg-soft sticky top-0 z-40 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="font-display font-bold whitespace-nowrap">
              <span className="text-gold">Recanto</span> CRM
            </span>
            <nav className="flex gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.id}
                  href={n.href}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    active === n.id ? "bg-primary/20 text-gold" : "text-muted hover:text-ink"
                  }`}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-muted hover:text-ink hidden sm:inline">
              ↗ site
            </Link>
            <form action={logoutAction}>
              <button className="text-sm text-muted hover:text-ink">Sair</button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
