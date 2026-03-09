import { Instagram, Youtube, Mail, MapPin, Truck, Shield, RotateCcw, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/5 mt-auto pt-20">
      
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-8">

          {/* Brand column */}
          <div className="lg:col-span-2 pr-0 lg:pr-20">
            <button onClick={() => navigate('/')} className="mb-8 block brightness-200">
              <img src="/Logo-Under.svg" alt="Under Sports" className="h-10 w-auto" />
            </button>
            <p className="text-white/40 text-[13px] leading-relaxed mb-8 max-w-sm font-medium">
              Curadoria estética do futebol. Camisas originais para quem vive o jogo. 
              Qualidade sem limites, entrega em todo o país.
            </p>
            <div className="flex items-center gap-6">
              {[
                { href: 'https://instagram.com', Icon: Instagram, label: 'Instagram' },
                { href: 'https://youtube.com',   Icon: Youtube,   label: 'YouTube' },
                { href: 'mailto:contato@undersports.com.br', Icon: Mail, label: 'E-mail' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-white/30 hover:text-white transition-all duration-300"
                >
                  <Icon size={18} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <div>
            <h3 className="text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8">Coleção</h3>
            <ul className="space-y-4">
              {[
                { label: 'Todas as Peças',  action: () => navigate('/') },
                { label: 'Copa do Mundo 2026',  action: () => navigate('/') },
                { label: 'Seleções Nacionais',  action: () => navigate('/') },
                { label: 'Clubes Europeus',  action: () => navigate('/') },
                { label: 'Novidades',    action: () => navigate('/') },
              ].map(({ label, action }) => (
                <li key={label}>
                  <button
                    onClick={action}
                    className="text-white/40 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8">Atendimento</h3>
            <ul className="space-y-4">
              {[
                'Guia de Tamanhos',
                'Rastrear Pedido',
                'Política de Troca',
                'P.F.A',
                'Contato',
              ].map((label) => (
                <li key={label}>
                  <button className="text-white/40 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors text-left">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8">Origem</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-3 text-white/40 text-[11px] font-bold uppercase tracking-widest leading-loose">
                <MapPin size={14} strokeWidth={1.5} className="shrink-0 text-white/20" />
                <span>São Paulo, SP<br/>Brasil — Frete Global</span>
              </div>
              <div className="pt-4 border-t border-white/5">
                <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.2em] mb-3">Pagamento</p>
                <div className="flex flex-wrap gap-4 text-white/40 text-[10px] font-bold">
                  <span>PIX</span>
                  <span>CARTÃO</span>
                  <span>BITCOIN</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Trust bar — Minimalist */}
      <div className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-between gap-8 opacity-20 hover:opacity-100 transition-opacity duration-700">
            {[
              { icon: Truck,     label: 'Entrega Global' },
              { icon: Shield,    label: 'Pagamento Criptografado' },
              { icon: RotateCcw, label: 'Troca em 7 Dias' },
              { icon: Zap,       label: 'Suporte Instantâneo' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon size={14} strokeWidth={1.5} className="text-white" />
                <span className="text-white text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.2em]">
            © {year} BRAVIO SPORTS CO. — TODOS OS DIREITOS RESERVADOS.
          </p>
          <div className="flex gap-8">
            <button className="text-white/20 hover:text-white/40 text-[9px] font-black uppercase tracking-[0.2em] transition-colors">Privacidade</button>
            <button className="text-white/20 hover:text-white/40 text-[9px] font-black uppercase tracking-[0.2em] transition-colors">Termos</button>
          </div>
        </div>
      </div>

    </footer>
  );
}
