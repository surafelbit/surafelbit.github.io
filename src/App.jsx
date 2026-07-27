import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import VariableProximity from './VariableProximity'

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
            FULLSTACK &amp; <br />
            MOBILE APP <br />
            <span className="accent-text">DEVELOPER</span>
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
        <div className="hero-photo-wrap">
          <img
            src="/png.png"
            alt="Surafel Muhabaw"
            className="hero-photo"
          />
          {/* Bottom fade into dark background */}
          <div className="photo-fade"></div>
        </div>

      </main>

    </div>
  )
}