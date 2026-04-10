"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring, Variants } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

export function HeroSection({ locale }: { locale: string }) {
  const t = useTranslations("Home");
  const ref = useRef(null);

  // Parallax configuration for the image side
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // The image moves downwards at a slower rate than the scroll (subtle luxury effect)
  const scrollYTransform = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  // 3D Tilt config for hero image
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  // Staggered variants for text
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section ref={ref} className="relative w-full min-h-[90vh] flex flex-col md:flex-row items-center justify-between overflow-hidden bg-background">

      {/* Abstract Glowing Orb for Dark Mode depth */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-gold-dark/10 dark:bg-gold-DEFAULT/5 blur-[120px] pointer-events-none z-0"
      />

      {/* Text Content Side layout adapts gracefully to RTL/LTR since Flexbox inherently reverses order for dir="rtl" */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20 z-10"
      >
        <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-playfair font-bold text-foreground leading-[1.1] tracking-wide mb-6">
          {t("hero_title")}
        </motion.h1>

        <motion.p variants={itemVariants} className="text-lg lg:text-xl text-taupe/80 dark:text-taupe max-w-md mb-12 leading-relaxed tracking-wide">
          {t("hero_subtitle")}
        </motion.p>

        <motion.div variants={itemVariants}>
          <Link
            href={`/${locale}/shop`}
            className="inline-flex items-center justify-center bg-foreground text-background px-10 py-5 uppercase text-xs sm:text-sm tracking-[0.2em] font-bold 
                       transition-all duration-500 hover:bg-[#383838] dark:hover:bg-[#ccc] hover:scale-[1.02] hover:shadow-[0_12px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_12px_30px_rgb(255,255,255,0.08)] active:scale-95"
          >
            {t("shop_now")}
          </Link>
        </motion.div>
      </motion.div>

      {/* Hero Image Side with Framer Motion Parallax, 3D Tilt, and floating elements */}
      <div
        className="w-full md:w-1/2 h-[50vh] md:h-[90vh] min-h-[400px] relative overflow-hidden perspective-1000 z-10"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1.05 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          style={{ y: scrollYTransform, rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="absolute inset-[-10%] w-[120%] h-[120%] origin-center"
        >
          <img
            src="/hero-collection.png"
            alt="Luxury Fashion Collection"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle overlay gradient to softly blend text and image */}
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-background/30 to-background/5" />

          {/* Floating Element 1 */}
          <motion.div
            animate={{ y: [0, -20, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ transform: "translateZ(80px)" }}
            className="absolute top-[20%] right-[15%] w-32 h-32 md:w-48 md:h-48 rounded-full border border-white/20 dark:border-white/10 glass-panel-heavy shadow-2xl flex items-center justify-center pointer-events-none"
          >
            <div className="w-full h-full rounded-full border border-white/10 border-dashed animate-[spin_30s_linear_infinite]" />
          </motion.div>

          {/* Floating Element 2 */}
          <motion.div
            animate={{ y: [0, 30, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            style={{ transform: "translateZ(120px)" }}
            className="absolute bottom-[15%] left-[10%] w-24 h-24 md:w-32 md:h-32 rounded-full border border-gold-light/20 bg-gold-dark/5 backdrop-blur-md shadow-2xl pointer-events-none"
          />
        </motion.div>
      </div>

    </section>
  );
}
