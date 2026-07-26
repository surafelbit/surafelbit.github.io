import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll, Stars, Sparkles } from '@react-three/drei'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>

        {/* --- THE 3D BACKGROUND LAYER (Unchanged) --- */}
        <Stars radius={100} depth={50} count={4000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={200} scale={12} size={2} speed={0.4} opacity={0.4} color="#00ff88" />

        <ScrollControls pages={2} damping={0.1}>

          {/* --- THE HTML FOREGROUND LAYER --- */}
          <Scroll html style={{ width: '100%' }}>

            <div className="hero-section">
              <h1 className="hero-title">
                I ENGINEER<br />
                SCALABLE APPS<br />
                FOR WEB &<br />
                MOBILE.
              </h1>

              <button className="btn-outline">VIEW MY WORK</button>
            </div>

          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  )
}