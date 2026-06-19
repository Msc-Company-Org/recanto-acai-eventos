import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { loginAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  if (await isAuthenticated()) redirect("/admin");
  const { erro } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-radial-glow">
      <form action={loginAction} className="glass-strong rounded-2xl p-8 w-full max-w-sm">
        <h1 className="font-display text-2xl font-bold text-white text-center">
          <span className="text-gold">Recanto</span> CRM
        </h1>
        <p className="text-muted text-sm text-center mt-1 mb-6">Acesso restrito</p>
        {erro && (
          <p className="text-red-400 text-sm mb-3 text-center">Usuário ou senha inválidos.</p>
        )}
        <input
          name="user"
          placeholder="Usuário"
          defaultValue="admin"
          className="w-full rounded-lg bg-bg/60 border border-line px-4 py-3 mb-3 text-ink outline-none focus:border-primary"
        />
        <input
          name="pass"
          type="password"
          placeholder="Senha"
          className="w-full rounded-lg bg-bg/60 border border-line px-4 py-3 mb-5 text-ink outline-none focus:border-primary"
        />
        <button className="w-full rounded-full bg-gold text-bg font-semibold py-3 hover:bg-gold-soft transition-colors">
          Entrar
        </button>
        <p className="text-muted text-xs text-center mt-4">padrão: admin / admin</p>
      </form>
    </div>
  );
}
