import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const whatsappUrl = "https://api.whatsapp.com/send?phone=5537991240924&text=Oi%20vim%20direto%20do%20site%20da%20Under%20Sports%2C%20e%20preciso%20de%20ajuda!";

  return (
    <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[100] flex items-center gap-4 group pointer-events-none">
      {/* Label que aparece no hover */}
      <motion.span 
        initial={{ opacity: 0, x: 20 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="bg-black/80 backdrop-blur-md border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.2em] px-5 py-3 rounded-full hidden lg:block shadow-2xl"
      >
        Suporte Instantâneo
      </motion.span>

      {/* Container clicável e animado - Agora sim com área exata */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative pointer-events-auto flex items-center justify-center"
      >
        {/* Botão Principal */}
        <div className="w-14 h-14 lg:w-16 lg:h-16 bg-black border border-white/10 flex items-center justify-center rounded-full text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:bg-[#25D366] group-hover:border-[#25D366] group-hover:text-black group-hover:shadow-[0_0_30px_rgba(37,211,102,0.4)] relative z-10">
          <MessageCircle size={28} strokeWidth={1.5} className="lg:w-8 lg:h-8" />
        </div>

        {/* Anel de pulsação mais contido e restrito ao botão */}
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-white/10 rounded-full z-0 group-hover:bg-[#25D366]/30 pointer-events-none"
        />
      </motion.a>
    </div>
  );
}
