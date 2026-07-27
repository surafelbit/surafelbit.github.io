import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { motion } from 'motion/react'
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


export default function App() {
  const bioContainerRef = useRef(null)
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

    </div>
  )
}