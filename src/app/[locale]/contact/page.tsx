"use client";

import { useLocale } from "next-intl";
import { motion, Variants } from "framer-motion";
import { MessageCircle, MapPin, ExternalLink, Send } from "lucide-react";

// Social platform config
const SOCIAL_LINKS = [
  {
    id: "instagram",
    label: "Instagram",
    handle: "@loro_piana28",
    url: "https://www.instagram.com/loro_piana28?igsh=MXBlOWFjZTV0YnkyOA==",
    color: "from-rose-500 via-fuchsia-500 to-orange-400",
    textColor: "text-rose-500",
    borderColor: "border-rose-100",
    bg: "bg-rose-50",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
  {
    id: "facebook",
    label: "Facebook",
    handle: "Loro Piana 28",
    url: "https://www.facebook.com/share/1878Kxvzyk/?mibextid=wwXIfr",
    color: "from-blue-600 to-blue-500",
    textColor: "text-blue-600",
    borderColor: "border-blue-100",
    bg: "bg-blue-50",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    id: "tiktok",
    label: "TikTok",
    handle: "@el_naoui1",
    url: "https://www.tiktok.com/@el_naoui1?_r=1&_t=ZS-95AywButfAS",
    color: "from-slate-900 via-slate-800 to-slate-700",
    textColor: "text-slate-900",
    borderColor: "border-slate-200",
    bg: "bg-slate-50",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
  },
  {
    id: "snapchat",
    label: "Snapchat",
    handle: "Snapchat",
    url: "https://snapchat.com/t/JQHp759M",
    color: "from-yellow-400 to-yellow-300",
    textColor: "text-yellow-600",
    borderColor: "border-yellow-100",
    bg: "bg-yellow-50",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.613-.42-1.139-.779-1.724-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.062-.046-.135-.046-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/>
      </svg>
    ),
  },
];

// animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ContactPage() {
  const locale = useLocale() as "fr" | "ar";
  const isRTL = locale === "ar";

  const t = {
    title: locale === "fr" ? "Contact" : "تواصل معنا",
    subtitle:
      locale === "fr"
        ? "Nous sommes à votre écoute. Contactez-nous via nos plateformes."
        : "نحن هنا للاستماع إليكم. تواصلوا معنا عبر منصاتنا.",
    social: locale === "fr" ? "Nos Réseaux Sociaux" : "شبكاتنا الاجتماعية",
    socialSub:
      locale === "fr"
        ? "Rejoignez notre communauté sur vos plateformes préférées."
        : "انضموا إلى مجتمعنا على منصاتكم المفضلة.",
    visit: locale === "fr" ? "Visiter" : "زيارة",
    whatsapp: locale === "fr" ? "WhatsApp" : "واتساب",
    whatsappText:
      locale === "fr"
        ? "Contactez-nous directement pour toute question ou commande."
        : "تواصلوا معنا مباشرةً لأي استفسار أو طلب.",
    whatsappBtn:
      locale === "fr" ? "Envoyer un message" : "إرسال رسالة",
    location: locale === "fr" ? "Notre Emplacement" : "موقعنا",
    locationSub:
      locale === "fr"
        ? "Retrouvez-nous à notre adresse. Nous vous accueillons avec plaisir."
        : "جدونا في عنوانناً. يسعدنا استقبالكم.",
    mapBtn: locale === "fr" ? "Voir sur Google Maps" : "عرض على خرائط جوجل",
    address: locale === "fr" ? "Adresse confirmée par localisation" : "العنوان مؤكد بالموقع الجغرافي",
    hours: locale === "fr" ? "Disponible 7j/7" : "متاح 7 أيام في الأسبوع",
  };

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* ── Hero Header ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 to-[#00487A] text-white">
        {/* Decorative noise texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox%3D%220 0 256 256%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter id%3D%22noise%22%3E%3CfeTurbulence type%3D%22fractalNoise%22 baseFrequency%3D%220.9%22 numOctaves%3D%224%22 stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect width%3D%22100%25%22 height%3D%22100%25%22 filter%3D%22url(%23noise)%22%2F%3E%3C%2Fsvg%3E')]" />

        <div className="relative max-w-4xl mx-auto px-6 py-28 text-center">
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-6"
          >
            Loro Piana 28
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-playfair text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none text-white mb-6"
          >
            {t.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-white/60 text-base md:text-lg font-light max-w-xl mx-auto leading-relaxed"
          >
            {t.subtitle}
          </motion.p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-20 space-y-20">

        {/* ── Social Media Sections ── */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="font-playfair text-3xl md:text-4xl font-black uppercase tracking-tight text-foreground mb-3">
              {t.social}
            </h2>
            <p className="text-muted-foreground text-sm font-light max-w-md mx-auto">
              {t.socialSub}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {SOCIAL_LINKS.map((platform) => (
              <motion.a
                key={platform.id}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                className={`group relative overflow-hidden rounded-2xl border ${platform.borderColor} ${platform.bg} p-6 flex items-center gap-5 transition-all duration-300 hover:shadow-xl hover:shadow-[color-mix(in_srgb,var(--foreground)_10%,transparent)]`}
              >
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                {/* Icon circle */}
                <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center ${platform.bg} border ${platform.borderColor} shadow-sm flex-shrink-0 ${platform.textColor} transition-transform duration-300 group-hover:scale-110`}>
                  {platform.icon}
                </div>

                <div className="relative flex-1 min-w-0">
                  <p className="font-black text-foreground text-base uppercase tracking-tight">
                    {platform.label}
                  </p>
                  <p className={`text-xs font-semibold ${platform.textColor} mt-0.5 truncate`}>
                    {platform.handle}
                  </p>
                </div>

                <div className={`relative flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${platform.borderColor} ${platform.textColor} bg-white/70 group-hover:bg-white transition-all`}>
                  {t.visit}
                  <ExternalLink size={11} />
                </div>
              </motion.a>
            ))}
          </motion.div>
        </section>

        {/* ── WhatsApp Section ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <a
            href="https://wa.me/213558554257"
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00487A] to-slate-900 p-8 md:p-10 text-white shadow-2xl shadow-slate-900/20 hover:shadow-slate-900/30 transition-all duration-500">

              {/* Background shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

              {/* Decorative circle */}
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/5 rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />

              <div className={`relative flex flex-col md:flex-row items-center gap-6 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/15 transition-colors">
                  <MessageCircle size={36} strokeWidth={1.5} />
                </div>

                <div className={`flex-1 text-center md:text-${isRTL ? 'right' : 'left'}`}>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">
                    WhatsApp
                  </p>
                  <h3 className="font-playfair text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-tight mb-1">
                    {t.whatsappText}
                  </h3>
                </div>

                <div className="flex-shrink-0">
                  <div className="flex items-center gap-2 px-6 py-4 rounded-xl bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest shadow-lg group-hover:shadow-xl group-hover:scale-[1.02] transition-all duration-300">
                    <Send size={14} />
                    {t.whatsappBtn}
                  </div>
                </div>
              </div>
            </div>
          </a>
        </motion.section>

        {/* ── Location / Google Maps Section ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-10 text-center">
            <h2 className="font-playfair text-3xl md:text-4xl font-black uppercase tracking-tight text-foreground mb-3">
              {t.location}
            </h2>
            <p className="text-muted-foreground text-sm font-light max-w-md mx-auto">
              {t.locationSub}
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-border shadow-xl shadow-foreground/5">
            {/* Map pin header bar */}
            <div className="bg-foreground px-6 py-4 flex items-center justify-between">
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center">
                  <MapPin size={16} className="text-background" />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-background/40">
                    {locale === "fr" ? "Emplacement" : "الموقع"}
                  </p>
                  <p className="text-xs font-bold text-background">Loro Piana 28</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/70" />
                <span className="w-3 h-3 rounded-full bg-amber-500/70" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
              </div>
            </div>

            {/* Styled map placeholder — luxury card */}
            <div className="relative bg-muted h-72 md:h-96 flex flex-col items-center justify-center gap-6 p-8">
              {/* Grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.4]"
                style={{
                  backgroundImage: "linear-gradient(var(--foreground), transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                  opacity: 0.05
                }}
              />

              {/* Pulsing pin */}
              <div className="relative z-10 flex flex-col items-center gap-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/40">
                    <MapPin size={28} className="text-background" strokeWidth={1.5} />
                  </div>
                  <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                </div>

                <div className={`text-center bg-card/90 backdrop-blur-sm rounded-2xl px-8 py-5 shadow-lg border border-border max-w-xs`}>
                  <p className="font-playfair text-lg font-black text-foreground uppercase tracking-tight mb-1">
                    Loro Piana 28
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                    {t.address}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    {t.hours}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA footer */}
            <div className="bg-card px-6 py-5 border-t border-border flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">
                {locale === "fr" ? "Cliquez pour ouvrir l'itinéraire" : "انقر لفتح الاتجاهات"}
              </p>
              <a
                href="https://maps.app.goo.gl/Qbh5tUF1muhHYe6C9"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-colors group-hover:scale-105"
              >
                <MapPin size={13} />
                {t.mapBtn}
              </a>
            </div>
          </div>
        </motion.section>

      </div>
    </main>
  );
}
