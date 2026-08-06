import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { motion, AnimatePresence } from 'motion/react'
import VariableProximity from './VariableProximity'
import SplitText from './SplitText'
import PageTurnTransition from './PageTurnTransition'
import ProjectDetailPage from './ProjectDetailPage'

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



const FEATURED_PROJECTS = [
  {
    id: 0,
    title: "Yegna Taxi — Digital Transit Fare",
    subtitle: "BDU AI Hackathon Winner",
    role: "AI & Digital Transit Architecture",
    description: "Architected a full-stack digital transit system using digital ID to securely verify individuals and make automatic taxi fare transactions, seamlessly replacing the legacy cash-based transportation ecosystem.",
    stack: ["Flutter", "Node.js", "PostgreSQL", "React.js"],
    link: "https://github.com/surafelbit",
    liveUrl: "https://yegnataxi-2.onrender.com",
    accent: "#ff6b2b",
    image: "/Screenshot 2026-07-27 165517.png"
  },
  {
    id: 1,
    title: "Deutsche Für Medicin College",
    subtitle: "Full-Stack Developer • 07/2025 – 01/2026 | Bahir Dar, Ethiopia",
    role: "Comprehensive Student Management System",
    description: "Developed a comprehensive student management system from the ground up. Designed an intuitive modern UI, built interactive frontend interfaces, engineered multi-step application registration pipelines, and constructed a robust, scalable backend architecture.",
    stack: ["React", "Tailwind CSS", "Node.js", "Express.js"],
    link: "https://github.com/surafelbit",
    liveUrl: "https://xn--deutsche-hochschule-fr-medizin-college-17d.tech/",
    accent: "#ff6b2b",
    image: "/Screenshot 2026-07-27 165327.png"
  },
  {
    id: 2,
    title: "Reactive Social Media App",
    subtitle: "Full-Featured Platform",
    role: "Full-Stack Web Application",
    description: "Built a reactive, high-speed social media platform equipped with instant live messaging, seamless post creation tools, and low-latency interactive feed synchronization.",
    stack: ["Laravel", "Vue.js"],
    link: "https://github.com/surafelbit",
    liveUrl: "https://social-pulse-vpfe.onrender.com/",
    accent: "#ff6b2b",
    image: "/Screenshot 2026-07-27 165351.png"
  },
  {
    id: 3,
    title: "Taxi Calling Engine",
    subtitle: "Real-Time Ride Booking",
    role: "Full-Stack Web Application",
    description: "Real-time interactive ride booking system with instant location dispatch, live driver tracking, and seamless fare calculation powered by Socket.io.",
    stack: ["Next.js", "Socket.io", "Tailwind CSS"],
    link: "https://github.com/surafelbit",
    accent: "#ff6b2b",
    image: null
  },
  {
    id: 5,
    title: "AI Study Companion",
    subtitle: "OpenAI-Powered Learning Tool",
    role: "Full-Stack Web Application",
    description: "Intelligent note summarization and study enhancement tool using OpenAI integrations for smart flashcard generation, topic breakdowns, and personalized revision schedules.",
    stack: ["React", "Node.js", "Express.js", "OpenAI"],
    link: "https://github.com/surafelbit",
    liveUrl: "https://e-learning-frontend-397l.vercel.app/",
    accent: "#ff6b2b",
    image: null
  },
  {
    id: 6,
    title: "Food Delivery & Social Discovery",
    subtitle: "High-Performance Mobile Platform",
    role: "Mobile Application",
    description: "High-performance platform combining rapid restaurant ordering with interactive social discovery, enabling users to explore trending venues and share food experiences in real time.",
    stack: ["Flutter", "Go"],
    link: "https://github.com/surafelbit",
    accent: "#ff6b2b",
    image: null
  }
];


export default function App() {
  const bioContainerRef = useRef(null)
  const [hoveredProject, setHoveredProject] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [selectedProject, setSelectedProject] = useState(null)
  const [isFlipping, setIsFlipping] = useState(false)
  const [pendingProject, setPendingProject] = useState(null)
  const [detailReady, setDetailReady] = useState(false)
  const [showDetail, setShowDetail] = useState(false)

  const handleProjectClick = useCallback((proj) => {
    if (isFlipping) return
    setPendingProject(proj)
    setDetailReady(false)
    setShowDetail(false)
    setIsFlipping(true)
  }, [isFlipping])

  // Phase 1 — canvas curl finishes: mount the detail page BEHIND the canvas
  const handleFlipMounted = useCallback(() => {
    setSelectedProject(pendingProject)
    setDetailReady(true)   // detail mounts, still hidden under canvas
  }, [pendingProject])

  // Phase 2 — canvas has faded: reveal the detail page and remove canvas
  const handleFlipComplete = useCallback(() => {
    setShowDetail(true)
    setIsFlipping(false)
  }, [])

  const handleClose = useCallback(() => {
    setShowDetail(false)
    setDetailReady(false)
    setTimeout(() => setSelectedProject(null), 400)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.completeAppLoading) {
        window.completeAppLoading()
      }
    }, 450) // Short buffer for canvas 3D and fonts to render smoothly
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>

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
          <a href="/Surafel Muhabaw CV.pdf" download className="btn btn-outline" style={{ padding: '0.6rem 1.4rem' }}>Resume</a>
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
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <span className="about-label-line" />
          About Me
          <span className="about-label-line" />
        </motion.div>
        {/** */}
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
          viewport={{ once: false, amount: 0.4 }}
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
              { name: 'Python', icon: 'python/python-original' },
              { name: 'JavaScript', icon: 'javascript/javascript-original' },
              { name: 'TypeScript', icon: 'typescript/typescript-original' },
              { name: 'PHP', icon: 'php/php-original' },
              { name: 'Go', icon: 'go/go-original-wordmark' },
              { name: 'Dart', icon: 'dart/dart-original' },
              { name: 'HTML5', icon: 'html5/html5-original' },
              { name: 'CSS3', icon: 'css3/css3-original' },
            ],
          },
          {
            category: 'Frontend',
            skills: [
              { name: 'React.js', icon: 'react/react-original' },
              { name: 'Next.js', icon: 'nextjs/nextjs-original', invert: true },
              { name: 'Vue.js', icon: 'vuejs/vuejs-original' },
              { name: 'Tailwind CSS', icon: 'tailwindcss/tailwindcss-original' },
            ],
          },
          {
            category: 'Backend',
            skills: [
              { name: 'Node.js', icon: 'nodejs/nodejs-original' },
              { name: 'Express.js', icon: 'express/express-original', invert: true },
              { name: 'Nest.js', icon: 'nestjs/nestjs-original' },
              { name: 'Laravel', icon: 'laravel/laravel-original' },
            ],
          },
          {
            category: 'Database & ORM',
            skills: [
              { name: 'PostgreSQL', icon: 'postgresql/postgresql-original' },
              { name: 'MongoDB', icon: 'mongodb/mongodb-original' },
              { name: 'Mongoose', icon: 'mongodb/mongodb-original' },
              { name: 'Prisma', icon: 'prisma/prisma-original', invert: true },
            ],
          },
          {
            category: 'Tools',
            skills: [
              { name: 'Git', icon: 'git/git-original' },
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

      {/* --- EXPERIENCE & JOURNEY SECTION --- */}
      <section className="experience-section" id="experience">

        <motion.div
          className="about-label"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <span className="about-label-line" />
          Experience & Journey
          <span className="about-label-line" />
        </motion.div>

        <motion.h2
          className="skills-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Where I've been<span className="skills-dot">.</span>
        </motion.h2>

        <div className="timeline-container">

          <div className="timeline-line" />

          {[
            {
              type: 'work',
              period: '07/2025 – 01/2026',
              role: 'Full Stack Developer',
              company: 'Deutsche Für Medicin College',
              location: 'Bahir Dar, Ethiopia',
              description: 'Led end-to-end development of a comprehensive student management system. Designed the full UI/UX, built interactive frontend interfaces with React, engineered multi-step registration pipelines, and architected a robust Node.js/Express backend.',
              tags: ['React', 'Node.js', 'Express.js', 'Tailwind CSS'],
              highlight: true,
            },
            {
              type: 'award',
              period: '2025',
              role: 'Hackathon Winner — 1st Place',
              company: 'BDU AI Hackathon',
              location: 'Bahir Dar University, Ethiopia',
              description: 'Won first place with Yegna Taxi — a full-stack digital transit fare system leveraging digital ID for secure, cashless taxi payments, replacing the legacy cash-based ecosystem.',
              tags: ['Flutter', 'Node.js', 'PostgreSQL', 'React.js'],
              highlight: false,
            },
            {
              type: 'work',
              period: '2024 – Present',
              role: 'Freelance Full Stack Developer',
              company: 'Independent',
              location: 'Remote',
              description: 'Delivered 10+ production web and mobile applications for clients across diverse industries. Specializing in React, Next.js, and Flutter frontends paired with Node.js and Laravel backends.',
              tags: ['Next.js', 'Laravel', 'Flutter', 'Go', 'PostgreSQL'],
              highlight: false,
            },
            {
              type: 'award',
              period: '2024',
              role: 'Hackathon Winner — Top Prize',
              company: 'Regional Tech Hackathon',
              location: 'Ethiopia',
              description: 'Secured top honors in a regional hackathon with a high-performance social discovery and food delivery mobile platform built with Flutter and Go.',
              tags: ['Flutter', 'Go'],
              highlight: false,
            },
            {
              type: 'education',
              period: '2021 – Present',
              role: 'B.Sc. Software Engineering',
              company: 'Bahir Dar University',
              location: 'Bahir Dar, Ethiopia',
              description: 'Studying software engineering with focus areas in distributed systems, algorithms, and modern application architectures. Active in hackathons, open-source, and student tech communities.',
              tags: ['Algorithms', 'Distributed Systems', 'Software Architecture'],
              highlight: false,
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className={`timeline-item ${idx % 2 === 0 ? 'timeline-left' : 'timeline-right'}`}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.05 * idx, ease: 'easeOut' }}
            >
              {/* Dot on the center line */}
              <div className={`timeline-dot ${item.type === 'award' ? 'timeline-dot-award' : item.type === 'education' ? 'timeline-dot-edu' : ''}`}>
                {item.type === 'award' ? '★' : item.type === 'education' ? '🎓' : ''}
              </div>

              <div className={`timeline-card ${item.highlight ? 'timeline-card-featured' : ''}`}>
                <div className="timeline-card-top">
                  <span className="timeline-period">{item.period}</span>
                  <span className={`timeline-type-badge timeline-type-${item.type}`}>
                    {item.type === 'work' ? 'Work' : item.type === 'award' ? 'Award' : 'Education'}
                  </span>
                </div>

                <h3 className="timeline-role">{item.role}</h3>

                <div className="timeline-company">
                  <span className="timeline-company-name">{item.company}</span>
                  <span className="timeline-company-sep">·</span>
                  <span className="timeline-company-loc">{item.location}</span>
                </div>

                <p className="timeline-desc">{item.description}</p>

                <div className="timeline-tags">
                  {item.tags.map(tag => (
                    <span key={tag} className="timeline-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

        </div>

      </section>

      {/* --- PROJECTS SECTION — Full-Width List + Hover Popup --- */}
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

        {/* ── Full-Width Project List ── */}
        <div
          className="proj-fullwidth-list"
          onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
        >
          {FEATURED_PROJECTS.map((proj, index) => {
            const isHovered = hoveredProject === index;
            return (
              <motion.div
                key={proj.id}
                className={`proj-row ${isHovered ? 'is-active' : ''}`}
                style={{ '--proj-accent': proj.accent }}
                onMouseEnter={() => setHoveredProject(index)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => handleProjectClick(proj)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
              >
                {/* Divider line at top */}
                <div className="proj-row-divider" />

                <div className="proj-row-inner">
                  {/* Number */}
                  <span className="proj-row-number">_{String(index + 1).padStart(2, '0')}.</span>

                  {/* Title + stack */}
                  <div className="proj-row-content">
                    <h3 className="proj-row-title">{proj.title}</h3>
                    <div className="proj-row-stack">
                      {proj.stack.map(tech => (
                        <span key={tech} className="proj-row-tech">{tech}</span>
                      ))}
                    </div>
                  </div>

                  {/* Click hint arrow */}
                  <div
                    className="proj-row-play"
                    style={{ borderColor: isHovered ? proj.accent : 'rgba(255,255,255,0.15)', color: isHovered ? proj.accent : 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
                  >
                    ▶
                  </div>
                </div>
              </motion.div>
            );
          })}
          {/* Bottom divider */}
          <div className="proj-row-divider" />

          {/* ── Floating Hover Popup ── */}
          <AnimatePresence>
            {hoveredProject !== null && FEATURED_PROJECTS[hoveredProject].image && (
              <motion.div
                className="proj-hover-popup"
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 20 }}
                transition={{ duration: 0.28, ease: [0.25, 0.8, 0.25, 1] }}
                style={{
                  left: `${mousePos.x + 20}px`,
                  top: `${mousePos.y + 20}px`,
                }}
              >
                <div className="proj-popup-panel" style={{ borderColor: `${FEATURED_PROJECTS[hoveredProject].accent}66` }}>
                  <div className="proj-popup-viewport">
                    <img
                      src={FEATURED_PROJECTS[hoveredProject].image}
                      alt={FEATURED_PROJECTS[hoveredProject].title}
                      className="proj-popup-image"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </section>

      {/* ── Page Turn Transition overlay ── */}
      <PageTurnTransition
        isAnimating={isFlipping}
        onMounted={handleFlipMounted}
        onComplete={handleFlipComplete}
        accentColor={pendingProject?.accent || '#00ff88'}
      />

      <AnimatePresence>
        {detailReady && selectedProject && (
          <ProjectDetailPage
            project={selectedProject}
            onClose={handleClose}
            visible={showDetail}
          />
        )}
      </AnimatePresence>

      {/* ── CONTACT SECTION ── */}
      <section className="contact-section" id="contact">

        {/* Background glow blob */}
        <div className="contact-glow" />

        {/* Section label */}
        <motion.div
          className="about-label"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <span className="about-label-line" />
          Get In Touch
          <span className="about-label-line" />
        </motion.div>

        {/* Big CTA headline */}
        <motion.div
          className="contact-headline-wrap"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        >
          <h2 className="contact-headline">
            Let's build something<br />
            <span className="contact-headline-accent">remarkable.</span>
          </h2>
          <div className="contact-avail-badge">
            <span className="contact-avail-dot" />
            Available for new projects
          </div>
        </motion.div>

        {/* Two-column: left info + right form */}
        <div className="contact-body">

          {/* LEFT — info */}
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p className="contact-info-text">
              Whether you have a project in mind, want to collaborate, or just want to say hi — my inbox is always open. I'll get back to you within 24 hours.
            </p>

            <div className="contact-links">
              <a href="mailto:surafelmuhabaw@gmail.com" className="contact-link">
                <span className="contact-link-icon">✉</span>
                <span>surafelmuhabaw@gmail.com</span>
                <span className="contact-link-arrow">↗</span>
              </a>
              <a href="https://github.com/surafelbit" target="_blank" rel="noreferrer" className="contact-link">
                <span className="contact-link-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                </span>
                <span>github.com/surafelbit</span>
                <span className="contact-link-arrow">↗</span>
              </a>
              <a href="https://linkedin.com/in/surafelmuhabaw" target="_blank" rel="noreferrer" className="contact-link">
                <span className="contact-link-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                </span>
                <span>linkedin.com/in/surafelmuhabaw</span>
                <span className="contact-link-arrow">↗</span>
              </a>
            </div>
          </motion.div>

          {/* RIGHT — form */}
          <motion.form
            className="contact-form"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            onSubmit={(e) => {
              e.preventDefault()
              const form = e.target
              const data = new FormData(form)
              const mailto = `mailto:surafelmuhabaw@gmail.com?subject=${encodeURIComponent(data.get('subject') || 'Portfolio inquiry')}&body=${encodeURIComponent(`Name: ${data.get('name')}\n\n${data.get('message')}`)}`
              window.location.href = mailto
            }}
          >
            <div className="contact-form-row">
              <div className="contact-field">
                <label className="contact-label">Name</label>
                <input name="name" className="contact-input" type="text" placeholder="Your name" required />
              </div>
              <div className="contact-field">
                <label className="contact-label">Email</label>
                <input name="email" className="contact-input" type="email" placeholder="your@email.com" required />
              </div>
            </div>
            <div className="contact-field">
              <label className="contact-label">Subject</label>
              <input name="subject" className="contact-input" type="text" placeholder="What's this about?" />
            </div>
            <div className="contact-field">
              <label className="contact-label">Message</label>
              <textarea name="message" className="contact-textarea" rows={5} placeholder="Tell me about your project, idea, or just say hello..." required />
            </div>
            <button type="submit" className="contact-submit">
              <span>Send Message</span>
              <span className="contact-submit-arrow">→</span>
            </button>
          </motion.form>

        </div>

        {/* Footer */}
        <div className="contact-footer">
          <div className="contact-footer-brand">
            <span className="contact-footer-name">Surafel Muhabaw</span>
            <span className="contact-footer-sep">·</span>
            <span className="contact-footer-role">Full Stack &amp; Mobile Developer</span>
          </div>
          <p className="contact-footer-copy">© {new Date().getFullYear()} — Designed &amp; built by Surafel Muhabaw</p>
        </div>

      </section>

    </div>
  )
}