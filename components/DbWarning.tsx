export function DbWarning() {
  return (
    <div className="glass rounded-2xl p-8 text-center">
      <h2 className="font-display text-xl text-white mb-2">Banco não configurado</h2>
      <p className="text-muted text-sm">
        Defina a variável <code className="text-gold">DATABASE_URL</code> (Supabase) na Vercel e
        no <code className="text-gold">.env.local</code> para ativar o CRM.
      </p>
    </div>
  );
}
