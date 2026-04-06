import React, { useRef } from 'react'
import { useGLTF, Html } from '@react-three/drei'
import { useLabStore } from '../store'

export default function Burner(props) {
  // Pointing to your lowercase models folder
  const { nodes, materials } = useGLTF('/models/burner.glb')

  const { temperature, setTemperature } = useLabStore()

  // Math to scale the flame from 0 to 1 based on how hot it is
  const flameScale = Math.max(0.001, (temperature - 20) / 80);

  const btnStyle = {
    background: 'rgba(15, 23, 42, 0.85)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    backdropFilter: 'blur(8px)',
    pointerEvents: 'auto',
    transition: 'background 0.2s',
  };

  return (
    <group {...props} dispose={null}>

      {/* Your Exact Bunsen Burner Meshes */}
      <mesh geometry={nodes.Bunsen_Burner_Bunsen_Burner_Mat_0.geometry} material={materials.Bunsen_Burner_Mat} />
      <mesh geometry={nodes.Pipe_Bunsen_Burner_Mat_0.geometry} material={materials.Bunsen_Burner_Mat} position={[0.069, 0.021, 0]} />

      {/* THE PAYOFF: Dynamic 3D Flame */}
      {/* If it's hotter than room temp, render the flame */}
      {temperature > 25 && (
        <mesh
          position={[0, 0.35, 0]} /* YOU MAY NEED TO TWEAK THIS Y VALUE so it sits on the nozzle */
          scale={[1, flameScale, 1]}
        >
          <coneGeometry args={[0.08, 0.4, 16]} />
          {/* Cyan/Blue core for a realistic, hot gas flame */}
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} depthWrite={false} />
        </mesh>
      )}

      {/* Digital Temperature Readout & Controls */}
      <Html position={[0, -0.1, 0.3]} center zIndexRange={[100, 0]}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          
          <button 
             onPointerDown={(e) => e.stopPropagation()} 
             onClick={() => setTemperature(Math.max(20, temperature - 5))} 
             style={btnStyle}
             onMouseOver={(e) => e.target.style.background = 'rgba(15, 23, 42, 1)'}
             onMouseOut={(e) => e.target.style.background = 'rgba(15, 23, 42, 0.85)'}
          >
             -
          </button>

          <div style={{
            background: temperature > 70 ? 'rgba(239, 68, 68, 0.85)' : 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: `1px solid ${temperature > 70 ? 'rgba(252, 165, 165, 0.5)' : 'rgba(148, 163, 184, 0.3)'}`,
            color: temperature > 70 ? '#fef2f2' : '#f8fafc', 
            padding: '6px 14px',
            borderRadius: '20px', 
            fontFamily: "'Outfit', sans-serif", 
            fontSize: '14px',
            fontWeight: '700', 
            pointerEvents: 'none',
            boxShadow: temperature > 70 ? '0 4px 12px rgba(239, 68, 68, 0.3)' : '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap'
          }}>
            <span style={{ fontSize: '16px' }}>🔥</span> {temperature}°C
          </div>

          <button 
             onPointerDown={(e) => e.stopPropagation()} 
             onClick={() => setTemperature(Math.min(100, temperature + 5))} 
             style={btnStyle}
             onMouseOver={(e) => e.target.style.background = 'rgba(15, 23, 42, 1)'}
             onMouseOut={(e) => e.target.style.background = 'rgba(15, 23, 42, 0.85)'}
          >
             +
          </button>

        </div>
      </Html>
    </group>
  )
}

useGLTF.preload('/models/burner.glb')