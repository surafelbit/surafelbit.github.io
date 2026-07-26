import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'

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
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>

      {/* --- 3D CANVAS BACKGROUND --- */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
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
        <a href="#contact" className="btn btn-outline" style={{ padding: '0.6rem 1.4rem' }}>
          Let's Talk
        </a>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="hero-container">

        {/* Left Column: Headlines & CTA */}
        <div className="hero-left">
          <h1 className="hero-title">
            FULLSTACK <br />
            <span className="accent-text">DEVELOPER</span>
          </h1>

          <p className="hero-bio">
            Passionate about architecting high-performance web systems and seamless mobile applications.
            Focused on clean backend logic and intuitive visual experiences.
          </p>

          <div className="cta-group">
            <a href="#contact" className="btn btn-primary">
              Hire Me
            </a>
            <a href="#resume" className="btn btn-outline">
              Resume
            </a>
          </div>
        </div>

        {/* Right Column: Key Stats */}
        <div className="stats-column">
          <div className="stat-item">
            <div className="stat-number">2+</div>
            <div className="stat-label">Years Experience</div>
          </div>

          <div className="stat-item">
            <div className="stat-number">10+</div>
            <div className="stat-label">Completed Projects</div>
          </div>

          <div className="stat-item">
            <div className="stat-number">2x</div>
            <div className="stat-label">Hackathon Winner</div>
          </div>
        </div>

      </main>

    </div>
  )
}