import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { motion, AnimatePresence } from 'motion/react'
import VariableProximity from './VariableProximity'
import SplitText from './SplitText'

// 3D Particle Field inspired by image #2 & #3
function ParticleField() {
  const ref = useRef()

  // Generate 2,000 random 3D particle positions
  const sphereParticles = useMemo(() => {
    const positions = new Float32Array(2000 * 3)
    for (let i = 0; i < 2000; i++) {
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = 2.5 + Math.random() * 1.5 // Radius range

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }
    return positions
  }, [])

  // Slowly rotate the particle cloud
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta * 0.05
    ref.current.rotation.y -= delta * 0.08
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphereParticles} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00ff66"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  )
}


// Helper Component to render custom animated website preview graphics
function ProjectMockupVisual({ type, accent }) {
  switch (type) {
    case 'gas-system':
      return (
        <div className="mockup-screen gas-mockup">
          <div className="mockup-header-bar">
            <span className="live-pill" style={{ borderColor: accent, color: accent }}>● LIVE TRACKING</span>
            <span className="system-status">QR AUTH : ENABLED</span>
          </div>
          <div className="mockup-body">
            <div className="fuel-chart-area">
              <div className="fuel-bar-wrap"><div className="fuel-bar bar-1" style={{ background: accent }}></div></div>
              <div className="fuel-bar-wrap"><div className="fuel-bar bar-2" style={{ background: accent }}></div></div>
              <div className="fuel-bar-wrap"><div className="fuel-bar bar-3" style={{ background: accent }}></div></div>
              <div className="fuel-bar-wrap"><div className="fuel-bar bar-4" style={{ background: accent }}></div></div>
            </div>
            <div className="mockup-info-box">
              <div className="mockup-row-title">Driver Quota Verification</div>
              <div className="mockup-row-sub">QR Scan Successful • Quota Deducted Securely</div>
            </div>
          </div>
        </div>
      );
    case 'taxi-ai':
      return (
        <div className="mockup-screen taxi-mockup">
          <div className="mockup-header-bar">
            <span className="live-pill" style={{ borderColor: accent, color: accent }}>● AI FARE ENGINE</span>
            <span className="system-status">DIGITAL ID verified</span>
          </div>
          <div className="mockup-body">
            <div className="transit-map-visual">
              <div className="pulse-circle" style={{ borderColor: accent }}>
                <div className="inner-dot" style={{ background: accent }}></div>
              </div>
              <div className="route-line" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}></div>
            </div>
            <div className="mockup-info-box">
              <div className="mockup-row-title">Automated Cashless Transaction</div>
              <div className="mockup-row-sub">Transit Fare : Complete • Zero Manual Friction</div>
            </div>
          </div>
        </div>
      );
    case 'med-college':
      return (
        <div className="mockup-screen med-mockup">
          <div className="mockup-header-bar">
            <span className="live-pill" style={{ borderColor: accent, color: accent }}>● DEUTSCHE MED PORTAL</span>
            <span className="system-status">BAHIR DAR, ETHIOPIA</span>
          </div>
          <div className="mockup-body">
            <div className="portal-pipeline">
              <div className="step-badge active-step" style={{ borderColor: accent, color: '#fff' }}>1. REGISTRATION</div>
              <div className="step-divider">→</div>
              <div className="step-badge active-step" style={{ borderColor: accent, color: '#fff' }}>2. DOC VERIFIED</div>
              <div className="step-divider">→</div>
              <div className="step-badge" style={{ background: accent, color: '#000', fontWeight: '700' }}>3. ENROLLED</div>
            </div>
            <div className="mockup-info-box">
              <div className="mockup-row-title">Student Management System</div>
              <div className="mockup-row-sub">Multi-step interactive registration pipelines</div>
            </div>
          </div>
        </div>
      );
    default:
      return (
        <div className="mockup-screen social-mockup">
          <div className="mockup-header-bar">
            <span className="live-pill" style={{ borderColor: accent, color: accent }}>● SOCIAL FEED WIRE</span>
            <span className="system-status">INSTANT MESSAGING</span>
          </div>
          <div className="mockup-body">
            <div className="chat-preview-cards">
              <div className="chat-bubble left">🚀 Post created: Real-time update deployed!</div>
              <div className="chat-bubble right" style={{ background: accent, color: '#fff' }}>Instant message delivered ✨</div>
            </div>
            <div className="mockup-info-box">
              <div className="mockup-row-title">Real-time Reactive Platform</div>
              <div className="mockup-row-sub">Powered by Laravel Backend &amp; Vue.js UI</div>
            </div>
          </div>
        </div>
      );
  }
}

const FEATURED_PROJECTS = [
  {
    id: 0,
    title: "Nedajie Gas Theft Control System",
    subtitle: "BDU Best Graduation Project Winner 2026",
    role: "Full-Stack Fuel Management",
    description: "Engineered a robust full-stack fuel management system to eliminate theft through real-time fuel distribution tracking. Integrated QR-code scanning to verify driver identity, validate allowances, and securely deduct quotas.",
    stack: ["Flutter", "Node.js", "MongoDB", "React.js"],
    link: "https://github.com/surafelbit",
    accent: "#00ff88",
    mockupType: "gas-system"
  },
  {
    id: 1,
    title: "Yegna Taxi — Digital Transit Fare",
    subtitle: "BDU AI Hackathon Winner",
    role: "AI & Digital Transit Architecture",
    description: "Architected a full-stack digital transit system using digital ID to securely verify individuals and make automatic taxi fare transactions, seamlessly replacing the legacy cash-based transportation ecosystem.",
    stack: ["Flutter", "Node.js", "PostgreSQL", "React.js"],
    link: "https://github.com/surafelbit",
    accent: "#00e5ff",
    mockupType: "taxi-ai"
  },
  {
    id: 2,
    title: "Deutsche Für Medicin College",
    subtitle: "Full-Stack Developer • 07/2025 – 01/2026 | Bahir Dar, Ethiopia",
    role: "Comprehensive Student Management System",
    description: "Developed a comprehensive student management system from the ground up. Designed an intuitive modern UI, built interactive frontend interfaces, engineered multi-step application registration pipelines, and constructed a robust, scalable backend architecture.",
    stack: ["React", "Tailwind CSS", "Node.js", "Express.js"],
    link: "https://github.com/surafelbit",
    accent: "#ff6b2b",
    mockupType: "med-college"
  },
  {
    id: 3,
    title: "Reactive Social Media App",
    subtitle: "Full-Featured Platform",
    role: "Full-Stack Web Application",
    description: "Built a reactive, high-speed social media platform equipped with instant live messaging, seamless post creation tools, and low-latency interactive feed synchronization.",
    stack: ["Laravel", "Vue.js"],
    link: "https://github.com/surafelbit",
    accent: "#d500f9",
    mockupType: "social-app"
  }
];

const ADDITIONAL_PROJECTS = [
  {
    title: "Taxi Calling Engine",
    stack: ["Next.js", "Socket.io", "Tailwind CSS"],
    desc: "Real-time interactive ride booking system with instant location dispatch."
  },
  {
    title: "Tour Booking System API",
    stack: ["Node.js", "Express.js", "MongoDB"],
    desc: "Robust backend API architecture tailored for scalable tour and itinerary management."
  },
  {
    title: "AI Study Companion",
    stack: ["React", "Node.js", "Express.js", "OpenAI"],
    desc: "Intelligent note summarization and study enhancement tool using OpenAI integrations."
  },
  {
    title: "Multi-Branch Inventory POS",
    stack: ["Flutter", "Nest.js", "React"],
    desc: "Cross-platform real-time retail application for synchronous multi-branch operations."
  },
  {
    title: "Food Delivery & Social Discovery",
    stack: ["Flutter", "Go"],
    desc: "High-performance platform combining rapid restaurant ordering with interactive social discovery."
  }
];


export default function App() {
  const bioContainerRef = useRef(null)
  const [hoveredProject, setHoveredProject] = useState(null)
  const [expandedProject, setExpandedProject] = useState(null)

  return (
    <div style={{ width: '100vw', minHeight: '100vh', position: 'relative' }}>

      {/* --- 3D CANVAS BACKGROUND --- */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.5} />
        <ParticleField />
      </Canvas>

      {/* --- NAVIGATION HEADER --- */}
      <nav className="nav-header">
        <div className="brand-badge">
          <div className="brand-name">Surafel Muhabaw</div>
          <div className="brand-role">Full Stack & Mobile Developer</div>
        </div>
        <div className="nav-actions">
          <a href="#resume" className="btn btn-outline" style={{ padding: '0.6rem 1.4rem' }}>Resume</a>
          <a href="#contact" className="btn btn-primary" style={{ padding: '0.6rem 1.4rem' }}>Let's Talk</a>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="hero-container">

        {/* LEFT: Text Content */}
        <div className="hero-left">

          <h1 className="hero-title">
            <motion.span
              className="title-line-1"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            >
              FULLSTACK &amp;
            </motion.span>
            <motion.span
              className="title-line-2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
            >
              MOBILE APP
            </motion.span>
            <motion.span
              className="title-line-3"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.55 }}
            >
              DEVELOPER
            </motion.span>
          </h1>

          <div
            ref={bioContainerRef}
            style={{ position: 'relative', maxWidth: '480px' }}
          >
            <p className="hero-bio">
              <VariableProximity
                label="Passionate about architecting high-performance web systems and seamless mobile applications. Focused on clean backend logic and intuitive visual experiences."
                fromFontVariationSettings="'wght' 300, 'opsz' 9"
                toFontVariationSettings="'wght' 800, 'opsz' 40"
                containerRef={bioContainerRef}
                radius={120}
                falloff="linear"
              />
            </p>
          </div>



          {/* Stats Row */}
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-number">2+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">10+</div>
              <div className="stat-label">Completed Projects</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">2x</div>
              <div className="stat-label">Hackathon Winner</div>
            </div>
          </div>

        </div>

        {/* RIGHT: Portrait Photo */}
        <div className="hero-photo-outer">
          <div className="hero-photo-inner">
            <img
              src="/png.png"
              alt="Surafel Muhabaw"
              className="hero-photo"
            />
            <div className="photo-fade" />
          </div>
        </div>

      </main>
      {/* --- ABOUT SECTION --- */}
      <section className="about-section" id="about">

        {/* Top label */}
        <motion.div
          className="about-label"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <span className="about-label-line" />
          About Me
          <span className="about-label-line" />
        </motion.div>

        {/* Big statement — SplitText word-by-word reveal on scroll */}
        <div className="about-statement-wrap">
          <SplitText
            tag="h2"
            text="I'm a Software Engineer & Full Stack Developer — passionate about building products that are as functional as they are intuitive."
            className="about-statement"
            splitType="words"
            delay={60}
            duration={0.75}
            ease="power3.out"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.15}
            rootMargin="-60px"
            textAlign="left"
          />
        </div>

        {/* Tags row */}
        <motion.div
          className="about-tags"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {['2× Hackathon Winner', 'Award-Winning Projects', 'Full Stack', 'Mobile Dev', 'Clean Code'].map(tag => (
            <span key={tag} className="about-tag">{tag}</span>
          ))}
        </motion.div>

        {/* Two-column detail */}
        <div className="about-columns">
          <div className="about-col">
            <h3 className="about-col-title">What I Do</h3>
            <SplitText
              text="I work across the full stack — designing backend systems, crafting responsive frontends, and connecting everything in between. My focus is on performance, scalability, and experiences that feel effortless to use."
              className="about-col-text"
              splitType="words"
              delay={25}
              duration={0.6}
              ease="power2.out"
              from={{ opacity: 0, y: 20 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-40px"
              textAlign="left"
            />
          </div>

          <div className="about-col">
            <h3 className="about-col-title">My Edge</h3>
            <SplitText
              text="I've shipped award-winning products and competed — and won — at multiple hackathons. I bring both technical depth and product thinking to every project, making sure what ships is solid, maintainable, and genuinely useful."
              className="about-col-text"
              splitType="words"
              delay={25}
              duration={0.6}
              ease="power2.out"
              from={{ opacity: 0, y: 20 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-40px"
              textAlign="left"
            />
          </div>
        </div>

      </section>

      {/* --- SKILLS SECTION --- */}
      <section className="skills-section" id="skills">

        <motion.div
          className="about-label"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <span className="about-label-line" />
          Technical Skills
          <span className="about-label-line" />
        </motion.div>

        <motion.h2
          className="skills-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          My tech stack<span className="skills-dot">.</span>
        </motion.h2>

        {[
          {
            category: 'Languages',
            skills: [
              { name: 'Python',     icon: 'python/python-original' },
              { name: 'JavaScript', icon: 'javascript/javascript-original' },
              { name: 'TypeScript', icon: 'typescript/typescript-original' },
              { name: 'PHP',        icon: 'php/php-original' },
              { name: 'Go',         icon: 'go/go-original-wordmark' },
              { name: 'Dart',       icon: 'dart/dart-original' },
              { name: 'HTML5',      icon: 'html5/html5-original' },
              { name: 'CSS3',       icon: 'css3/css3-original' },
            ],
          },
          {
            category: 'Frontend',
            skills: [
              { name: 'React.js',     icon: 'react/react-original' },
              { name: 'Next.js',      icon: 'nextjs/nextjs-original', invert: true },
              { name: 'Vue.js',       icon: 'vuejs/vuejs-original' },
              { name: 'Tailwind CSS', icon: 'tailwindcss/tailwindcss-original' },
            ],
          },
          {
            category: 'Backend',
            skills: [
              { name: 'Node.js',    icon: 'nodejs/nodejs-original' },
              { name: 'Express.js', icon: 'express/express-original', invert: true },
              { name: 'Nest.js',    icon: 'nestjs/nestjs-original' },
              { name: 'Laravel',    icon: 'laravel/laravel-original' },
            ],
          },
          {
            category: 'Database & ORM',
            skills: [
              { name: 'PostgreSQL', icon: 'postgresql/postgresql-original' },
              { name: 'MongoDB',    icon: 'mongodb/mongodb-original' },
              { name: 'Mongoose',   icon: 'mongodb/mongodb-original' },
              { name: 'Prisma',     icon: 'prisma/prisma-original', invert: true },
            ],
          },
          {
            category: 'Tools',
            skills: [
              { name: 'Git',    icon: 'git/git-original' },
              { name: 'Docker', icon: 'docker/docker-original' },
              { name: 'GitHub', icon: 'github/github-original', invert: true },
            ],
          },
        ].map((group, gi) => (
          <div key={group.category} className="skill-group">
            <motion.h3
              className="skill-group-title"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              {group.category}
            </motion.h3>

            <div className="skill-logo-grid">
              {group.skills.map((skill, si) => (
                <motion.div
                  key={skill.name}
                  className="skill-logo-card"
                  initial={{ opacity: 0, y: 40, scale: 0.85 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: gi * 0.05 + si * 0.065, ease: 'easeOut' }}
                  whileHover={{
                    y: -20,
                    scale: 1.18,
                    rotateX: -8,
                    rotateY: 6,
                    transition: { duration: 0.22, ease: 'easeOut' }
                  }}
                  style={{ transformPerspective: 800 }}
                >
                  <motion.div
                    className="skill-logo-img-wrap"
                    whileHover={{ scale: 1.12 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img
                      src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${skill.icon}.svg`}
                      alt={skill.name}
                      className={`skill-logo-img${skill.invert ? ' skill-logo-invert' : ''}`}
                      loading="lazy"
                    />
                  </motion.div>
                  <span className="skill-logo-name">{skill.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

      </section>

      {/* --- PROJECTS SECTION --- */}
      <section className="projects-section" id="projects">
        <motion.div
          className="about-label"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <span className="about-label-line" />
          Selected Engineering Works
          <span className="about-label-line" />
        </motion.div>

        <motion.h2
          className="projects-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Featured innovations &amp; award-winning platforms<span className="skills-dot">.</span>
        </motion.h2>

        {/* Full-Width Interactive Expandable Showcase */}
        <div className="fullwidth-projects-list">
          {FEATURED_PROJECTS.map((proj, index) => {
            const isHovered = hoveredProject === index;
            const isExpanded = expandedProject === index;

            return (
              <motion.div
                key={proj.id}
                className={`fullwidth-project-card ${(isHovered || isExpanded) ? 'is-active-state' : ''}`}
                style={{ '--proj-accent': proj.accent }}
                onMouseEnter={() => setHoveredProject(index)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => setExpandedProject(isExpanded ? null : index)}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                {/* Top Header Bar: Always Visible */}
                <div className="fw-header-row">
                  <div className="fw-title-group">
                    <span className="fw-index" style={{ color: (isHovered || isExpanded) ? proj.accent : 'rgba(255,255,255,0.3)' }}>
                      0{index + 1}
                    </span>
                    <div>
                      <div className="fw-badge" style={{ borderColor: proj.accent, color: (isHovered || isExpanded) ? proj.accent : 'var(--text-muted)' }}>
                        ★ {proj.subtitle}
                      </div>
                      <h3 className="fw-title" style={{ color: (isHovered || isExpanded) ? proj.accent : '#fff' }}>
                        {proj.title}
                      </h3>
                    </div>
                  </div>

                  <div className="fw-tech-group">
                    <div className="fw-stack-pills">
                      {proj.stack.map(tech => (
                        <span key={tech} className="fw-pill">{tech}</span>
                      ))}
                    </div>
                    <div className="fw-interaction-cue" style={{ color: isExpanded ? proj.accent : 'rgba(255,255,255,0.45)' }}>
                      {isExpanded ? '▲ Hide Description' : '▼ Click for Description'}
                    </div>
                    <div className="fw-arrow-btn" style={{ background: (isHovered || isExpanded) ? proj.accent : 'rgba(255,255,255,0.06)', color: (isHovered || isExpanded) ? '#000' : '#fff' }}>
                      {isExpanded ? '✦' : '↗'}
                    </div>
                  </div>
                </div>

                {/* ON HOVER: Super Cool Animated Website Image Visual ONLY (NO DESCRIPTION!) */}
                <AnimatePresence>
                  {isHovered && !isExpanded && (
                    <motion.div
                      className="fw-website-preview-wrapper"
                      initial={{ height: 0, opacity: 0, scale: 0.92, rotateX: 14 }}
                      animate={{ height: "auto", opacity: 1, scale: 1, rotateX: 0, marginTop: 28 }}
                      exit={{ height: 0, opacity: 0, scale: 0.94, rotateX: -8, marginTop: 0 }}
                      transition={{ type: "spring", stiffness: 220, damping: 20 }}
                      style={{ overflow: 'hidden', transformPerspective: 900 }}
                    >
                      <div className="fw-browser-container super-cool-hover-box">
                        <div className="fw-browser-chrome">
                          <div className="browser-dots">
                            <span className="dot dot-red" />
                            <span className="dot dot-yellow" />
                            <span className="dot dot-green" />
                          </div>
                          <div className="browser-url-bar">
                            <span className="lock-icon">🔒</span> https://{proj.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.app
                          </div>
                          <div className="fw-status-chip" style={{ color: proj.accent, borderColor: proj.accent }}>
                            ● HOVER VISUAL PREVIEW • CLICK FOR FULL DESCRIPTION
                          </div>
                        </div>

                        {/* Interactive Website Graphic Mockup ONLY */}
                        <div className="fw-mockup-viewport">
                          <ProjectMockupVisual type={proj.mockupType} accent={proj.accent} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ON CLICK: Reveal Comprehensive Description, Architecture & Dedicated Launch Button! */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      className="fw-description-drawer"
                      initial={{ height: 0, opacity: 0, y: -10 }}
                      animate={{ height: "auto", opacity: 1, y: 0, marginTop: 28 }}
                      exit={{ height: 0, opacity: 0, y: -10, marginTop: 0 }}
                      transition={{ duration: 0.38, ease: [0.25, 0.8, 0.25, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="drawer-content-box" style={{ borderLeftColor: proj.accent }}>
                        <div className="drawer-header-label" style={{ color: proj.accent }}>
                          📖 Architecture &amp; System Overview
                        </div>
                        <p className="fw-description">
                          {proj.description}
                        </p>

                        <div className="drawer-actions-row">
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="drawer-launch-btn"
                            style={{ background: proj.accent }}
                          >
                            <span>Launch Dedicated Website</span>
                            <span className="launch-icon">↗</span>
                          </a>
                          <span className="drawer-close-hint">
                            (Click card again to fold details)
                          </span>
                        </div>
                      </div>

                      {/* We keep the high-res website visual inside the expanded drawer too for a seamless view */}
                      <div className="fw-browser-container expanded-browser-view" style={{ marginTop: '2.2rem' }}>
                        <div className="fw-browser-chrome">
                          <div className="browser-dots">
                            <span className="dot dot-red" />
                            <span className="dot dot-yellow" />
                            <span className="dot dot-green" />
                          </div>
                          <div className="browser-url-bar">
                            <span className="lock-icon">🔒</span> https://{proj.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.app
                          </div>
                          <div className="fw-status-chip" style={{ color: proj.accent, borderColor: proj.accent }}>
                            ● HOSTED LIVE PLATFORM
                          </div>
                        </div>
                        <div className="fw-mockup-viewport">
                          <ProjectMockupVisual type={proj.mockupType} accent={proj.accent} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })}
        </div>

        {/* Additional Engineering Works Grid */}
        <div className="additional-projects-section">
          <motion.h3
            className="additional-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
          >
            Additional Engineering Works &amp; Microservices
          </motion.h3>

          <div className="additional-grid">
            {ADDITIONAL_PROJECTS.map((ap, idx) => (
              <motion.div
                key={ap.title}
                className="additional-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -8, scale: 1.03 }}
              >
                <div className="additional-header">
                  <span className="folder-icon">📂</span>
                  <span className="external-link-icon">↗</span>
                </div>
                <h4 className="additional-title">{ap.title}</h4>
                <p className="additional-desc">{ap.desc}</p>
                <div className="additional-stack">
                  {ap.stack.map(st => (
                    <span key={st} className="additional-tag">{st}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </section>

    </div>
  )
}