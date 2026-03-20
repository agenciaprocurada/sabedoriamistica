import { MobileMenu } from "./MobileMenu";

export interface HeaderUser {
  name: string;
  email: string;
}

interface HeaderProps {
  user: HeaderUser | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="relative z-40 w-full border-b border-gold-subtle bg-mystic-bg/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center gap-3 shrink-0 group">
          <div
            className="h-9 w-9 rounded-full flex items-center justify-center font-display font-bold text-mystic-bg text-sm shrink-0 group-hover:shadow-gold transition-shadow duration-200"
            style={{ background: "linear-gradient(135deg, #D4A843 0%, #E8C66A 50%, #A07D2E 100%)" }}
          >
            SM
          </div>
          <span className="font-display text-lg font-semibold text-text-primary group-hover:text-gold transition-colors duration-200">
            Sabedoria Mística
          </span>
        </a>

        {/* Ações desktop */}
        <nav className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="font-body text-text-secondary text-sm mr-1">
                {user.name || user.email}
              </span>
              <a
                href="/sonhos/meus"
                className="font-body text-sm border border-gold-subtle text-gold px-4 py-2 rounded-full hover:bg-gold-subtle transition-colors duration-200"
              >
                Meus Sonhos
              </a>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="font-body text-sm border border-gold-subtle text-gold px-4 py-2 rounded-full hover:bg-gold-subtle transition-colors duration-200"
                >
                  Sair
                </button>
              </form>
            </>
          ) : (
            <a
              href="/login"
              className="font-body text-sm bg-gold hover:bg-gold-light text-mystic-bg font-semibold px-5 py-2 rounded-full shadow-gold transition-colors duration-200"
            >
              Entrar
            </a>
          )}
        </nav>

        {/* Menu mobile (client) */}
        <MobileMenu user={user} />
      </div>
    </header>
  );
}
