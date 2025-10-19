'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const committees = [
  {
    icon: null,
    name: "UNGA",
    fullName: "United Nations General Assembly",
    description:
      "Deliberate on wide-ranging global concerns, from peace and security to sustainable development and human rights.",
    logoUrl: "/UNGA.png",
  },
  {
    icon: null,
    name: "UNHRC",
    fullName: "United Nations Human Rights Council",
    description:
      "Champion and critique human-rights practices worldwide while drafting resolutions to protect vulnerable communities.",
    logoUrl: "/UNHRC.png",
  },
  {
    icon: null,
    name: "UNSC",
    fullName: "United Nations Security Council",
    description:
      "Respond to urgent conflicts with binding resolutions, sanctions, and peacekeeping mandates that reshape geopolitics.",
    logoUrl: "/UNSC.png",
    customScale: "scale-150",
  },
  {
    icon: null,
    name: "IP",
    fullName: "International Press",
    description:
      "Investigate proceedings, craft compelling narratives, and deliver real-time reporting that influences public perception.",
    logoUrl: "/IP.png",
  },
  {
    icon: null,
    name: "ICC",
    fullName: "International Cricket Council",
    description:
      "Strategize over fixtures, regulations, and the spirit of cricket while mediating international sporting diplomacy.",
    logoUrl: "/ICC.png",
    customScale: "scale-150",
  },
];

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const overlayVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.85 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1.08,
    transition: { type: 'spring', stiffness: 210, damping: 18, mass: 0.9, delay: 0.15 },
  },
  exit: {
    opacity: 0,
    y: 16,
    scale: 0.97,
    transition: { duration: 0.22, ease: 'easeInOut' },
  },
};

const mobileOverlayVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 240, damping: 22, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    y: 28,
    scale: 0.98,
    transition: { duration: 0.18, ease: 'easeInOut' },
  },
};

const CommitteesSection = () => {
  const [hoveredCommittee, setHoveredCommittee] = useState(null);
  const [activeCommittee, setActiveCommittee] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [overlayPosition, setOverlayPosition] = useState({ top: 0, height: 0 });

  const containerRef = useRef(null);
  const mobileOverlayRef = useRef(null);
  const cardRefs = useRef(new Map());

  const registerCardRef = useCallback((committeeName, node) => {
    if (node) {
      cardRefs.current.set(committeeName, node);
    } else {
      cardRefs.current.delete(committeeName);
    }
  }, []);

  const updateOverlayPosition = useCallback(() => {
    if (!isMobile || !activeCommittee) return;

    const cardElement = cardRefs.current.get(activeCommittee.name);
    const containerElement = containerRef.current;
    if (!cardElement || !containerElement) return;

    const containerRect = containerElement.getBoundingClientRect();
    const cardRect = cardElement.getBoundingClientRect();

    setOverlayPosition({
      top: cardRect.top - containerRect.top + (containerElement.scrollTop || 0),
      height: cardRect.height,
    });
  }, [isMobile, activeCommittee]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const handleChange = (event) => {
      setIsMobile(event.matches);
    };

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      setHoveredCommittee(null);
      return;
    }

    setActiveCommittee(null);
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || !activeCommittee) return;

    updateOverlayPosition();

    const handleReposition = () => {
      updateOverlayPosition();
    };

    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('orientationchange', handleReposition);

    return () => {
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('orientationchange', handleReposition);
    };
  }, [isMobile, activeCommittee, updateOverlayPosition]);

  useEffect(() => {
    if (!isMobile || !activeCommittee) return;

    const handleOutsideInteraction = (event) => {
      const cardElement = cardRefs.current.get(activeCommittee.name);
      if (cardElement?.contains(event.target)) {
        return;
      }

      if (mobileOverlayRef.current?.contains(event.target)) {
        return;
      }

      setActiveCommittee(null);
    };

    document.addEventListener('pointerdown', handleOutsideInteraction);

    return () => {
      document.removeEventListener('pointerdown', handleOutsideInteraction);
    };
  }, [isMobile, activeCommittee]);

  useEffect(() => {
    if (!activeCommittee) return;

    requestAnimationFrame(() => {
      updateOverlayPosition();
    });
  }, [activeCommittee, updateOverlayPosition]);

  const handleCardClick = useCallback((committee) => {
    setActiveCommittee((previous) =>
      previous?.name === committee.name ? null : committee,
    );
  }, []);

  const handleCardKeyDown = useCallback(
    (event, committee) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleCardClick(committee);
      }
    },
    [handleCardClick],
  );

  const isActiveCommittee = useCallback(
    (committeeName) => activeCommittee?.name === committeeName,
    [activeCommittee],
  );

  return (
    <section
      id="committees"
      className="relative overflow-hidden bg-gradient-to-b from-background via-background/90 to-dark-blue/40 py-24 sm:py-32"
    >
      <div className="absolute inset-0 top-[-10rem] flex items-center justify-center">
        <div className="h-[30rem] w-[80rem] rounded-full bg-mid-blue/10 blur-[10rem]" />
      </div>
      <div className="container relative z-10 mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-4xl font-medium text-text-primary sm:text-5xl"
        >
          Committees
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mb-16 max-w-2xl text-text-primary/70"
        >
          Engage in dynamic debate across a diverse range of domestic and international councils.
        </motion.p>

        <div className="relative mx-auto max-w-6xl" ref={containerRef}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            transition={{ staggerChildren: 0.15 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 md:grid-cols-3 lg:grid-cols-5"
          >
            {committees.map((committee) => (
              <motion.div
                key={committee.name}
                ref={(node) => registerCardRef(committee.name, node)}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300 }}
                onMouseEnter={() => {
                  if (!isMobile) {
                    setHoveredCommittee(committee);
                  }
                }}
                onMouseLeave={() => {
                  if (!isMobile) {
                    setHoveredCommittee(null);
                  }
                }}
                onFocus={() => {
                  if (!isMobile) {
                    setHoveredCommittee(committee);
                  }
                }}
                onBlur={() => {
                  if (!isMobile) {
                    setHoveredCommittee(null);
                  }
                }}
                onClick={() => {
                  if (isMobile) {
                    handleCardClick(committee);
                  }
                }}
                onKeyDown={(event) => handleCardKeyDown(event, committee)}
                role="button"
                tabIndex={0}
                aria-pressed={isActiveCommittee(committee.name)}
                aria-expanded={isActiveCommittee(committee.name)}
                className="group relative flex min-h-[15rem] w-full flex-col justify-end overflow-hidden rounded-3xl border border-mid-blue/20 bg-dark-blue/35 px-5 py-6 text-left shadow-[0_18px_45px_-20px_rgba(44,106,185,0.55)] transition-all duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mid-blue sm:min-h-[17rem] sm:px-6 sm:py-7 md:h-80 md:justify-end hover:-translate-y-3 hover:border-mid-blue/60 hover:bg-dark-blue/50 hover:shadow-[0_25px_60px_-25px_rgba(44,106,185,0.65)]"
                data-active={isActiveCommittee(committee.name)}
              >
                {committee.logoUrl && (
                  <Image
                    src={committee.logoUrl}
                    alt={`${committee.name} logo`}
                    fill
                    sizes="(min-width: 1024px) 240px, (min-width: 640px) 220px, 180px"
                    className={`absolute inset-0 h-full w-full opacity-[0.18] p-7 transition-transform duration-500 ease-out ${committee.customScale || ''} group-hover:scale-95`}
                  />
                )}
                <div className="relative z-10 flex flex-col gap-2">
                  {committee.icon && (
                    <div className="mb-3 text-accent">{committee.icon}</div>
                  )}
                  <h3 className="text-lg font-semibold text-text-primary sm:text-xl">
                    {committee.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-primary/70">
                    {committee.fullName}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <AnimatePresence>
            {!isMobile && hoveredCommittee && (
              <motion.div
                key={hoveredCommittee.name}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={overlayVariants}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex h-96 w-full -translate-x-1/2 -translate-y-1/2 items-center rounded-3xl border border-mid-blue/25 bg-gradient-to-br from-dark-blue/70 via-dark-blue/45 to-mid-blue/25 p-12 text-left shadow-[0_32px_82px_-28px_rgba(44,106,185,0.6)] backdrop-blur-xl backdrop-saturate-150"
              >
                <div className="relative flex h-full w-full items-center gap-10 text-text-primary">
                  {hoveredCommittee.logoUrl && (
                    <div className="relative hidden h-64 w-64 flex-shrink-0 overflow-hidden rounded-3xl border border-mid-blue/20 bg-dark-blue/40 p-6 shadow-[0_18px_45px_-22px_rgba(44,106,185,0.6)] sm:flex">
                      <Image
                        src={hoveredCommittee.logoUrl}
                        alt={`${hoveredCommittee.name} emblem`}
                        fill
                        sizes="256px"
                        className={`object-contain drop-shadow-[0_16px_30px_rgba(7,31,70,0.55)] ${hoveredCommittee.customScale || ''}`}
                      />
                    </div>
                  )}
                  <div className="max-w-2xl space-y-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-mid-blue/60">
                      Committee Spotlight
                    </p>
                    <div className="space-y-1">
                      <h3 className="text-3xl font-semibold">
                        {hoveredCommittee.name}
                      </h3>
                      <p className="text-base text-text-primary/60">
                        {hoveredCommittee.fullName}
                      </p>
                    </div>
                    <p className="text-base leading-relaxed text-text-primary/80">
                      {hoveredCommittee.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isMobile && activeCommittee && (
              <motion.div
                key={activeCommittee.name}
                ref={mobileOverlayRef}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={mobileOverlayVariants}
                className="pointer-events-auto absolute left-1/2 z-30 w-full max-w-[calc(100%-2.5rem)] -translate-x-1/2 rounded-3xl border border-mid-blue/25 bg-dark-blue/95/80 px-6 py-5 text-left text-text-primary shadow-[0_24px_48px_-22px_rgba(28,70,130,0.65)] backdrop-blur-md"
                style={{ top: overlayPosition.top, minHeight: overlayPosition.height }}
              >
                <div className="flex items-start gap-4">
                  {activeCommittee.logoUrl && (
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border border-mid-blue/25 bg-dark-blue/70 p-3 shadow-[0_12px_32px_-18px_rgba(44,106,185,0.55)]">
                      <Image
                        src={activeCommittee.logoUrl}
                        alt={`${activeCommittee.name} emblem`}
                        fill
                        sizes="64px"
                        className={`object-contain drop-shadow-[0_10px_20px_rgba(7,31,70,0.45)] ${activeCommittee.customScale || ''}`}
                      />
                    </div>
                  )}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-[0.35em] text-mid-blue/60">
                        Committee Spotlight
                      </p>
                      <h3 className="text-xl font-semibold">
                        {activeCommittee.name}
                      </h3>
                      <p className="text-sm text-text-primary/65">
                        {activeCommittee.fullName}
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed text-text-primary/80">
                      {activeCommittee.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default CommitteesSection;