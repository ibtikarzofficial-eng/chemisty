import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, DragControls, Html } from '@react-three/drei';
import { Suspense, useState, useRef } from 'react';
import * as THREE from 'three';
import { useLabStore, EXPERIMENTS } from './store';
import { Menu } from 'lucide-react';

import Table from './components/Table';
import Beaker from './components/Beaker';
import Flask from './components/Flask';
import Burner from './components/Burner';
import Sidebar from './components/Sidebar';
import ReactionModal from './components/ReactionModal';
import Decorations from './components/Decorations';
import './App.css';

// Shifted the target slightly higher to account for the new Hot Plate height
const BEAKER_POSITION = new THREE.Vector3(-0.8, -0.33, 0);
const POUR_TARGET_POSITION = new THREE.Vector3(-0.45, 0.44, 0);

function Bubbles() {
  const { isMixed, currentExp, reactionState } = useLabStore();
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (isMixed && reactionState === 'success' && groupRef.current) {
      groupRef.current.children.forEach((bubble, i) => {
        bubble.position.y += delta * (0.5 + i * 0.05);
        bubble.position.x += Math.sin(state.clock.elapsedTime * 5 + i) * 0.002;
        if (bubble.position.y > 0.5) bubble.position.y = -0.2;
      });
    }
  });

  if (!isMixed || reactionState !== 'success') return null;

  return (
    <group ref={groupRef} position={[-0.8, 0.5, 0]}>
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[(Math.random() - 0.5) * 0.1, -0.2, (Math.random() - 0.5) * 0.1]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial color={currentExp.color} transparent opacity={0.6} roughness={0} />
        </mesh>
      ))}
    </group>
  );
}

function InteractiveFlask({ setIsDragging, flaskData, index, total }) {
  const visualRef = useRef();
  const hitboxRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [isLocalDragging, setIsLocalDragging] = useState(false);
  const { isMixed, isPouring, triggerPour, triggerReaction, pouredFlaskId } = useLabStore();
  const { viewport } = useThree();

  const isMobile = viewport.width < 4;
  const spacing = isMobile ? 0.4 : 0.6;
  const offset = isMobile ? -0.1 : 0.2; // Adjusted offset slightly away from beaker
  const startX = offset + (index * spacing);
  const START_POS = new THREE.Vector3(startX, -0.49, 0);

  const isThisFlaskPouring = isPouring === flaskData.id;
  const hasThisFlaskFallen = isMixed && pouredFlaskId !== flaskData.id;

  useFrame((state, delta) => {
    if (!visualRef.current || !hitboxRef.current) return;

    if (hasThisFlaskFallen) {
      visualRef.current.position.lerp(START_POS, delta * 4);
      return;
    }

    if (isMixed && pouredFlaskId === flaskData.id) {
      visualRef.current.position.copy(POUR_TARGET_POSITION);
      visualRef.current.rotation.z = 1.3;
      return;
    }

    if (isThisFlaskPouring) {
      visualRef.current.position.lerp(POUR_TARGET_POSITION, delta * 6);
      visualRef.current.rotation.z = THREE.MathUtils.lerp(visualRef.current.rotation.z, 1.3, delta * 5);

      if (visualRef.current.rotation.z > 1.25) {
        triggerReaction(flaskData.id);
        setIsDragging(false);
      }
      return;
    }

    if (isPouring && !isThisFlaskPouring) {
      visualRef.current.position.lerp(START_POS, delta * 6);
      hitboxRef.current.position.copy(START_POS);
      return;
    }

    if (!isLocalDragging && !isThisFlaskPouring) {
      // If not dragging and not pouring, slowly lerp back to start position
      visualRef.current.position.lerp(START_POS, delta * 4);
      hitboxRef.current.position.lerp(START_POS, delta * 4);
    } else if (isLocalDragging) {
      hitboxRef.current.position.x = THREE.MathUtils.clamp(hitboxRef.current.position.x, -1.4, 2.0);
      hitboxRef.current.position.z = THREE.MathUtils.clamp(hitboxRef.current.position.z, -0.6, 0.6);
      
      const currentPos = new THREE.Vector3();
      hitboxRef.current.getWorldPosition(currentPos);
      visualRef.current.position.lerp(currentPos, delta * 10);
    }
  });

  const handleDragStart = () => {
    setIsDragging(true);
    setIsLocalDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setIsLocalDragging(false);

    if (hitboxRef.current && !isPouring) {
      const currentPos = new THREE.Vector3();
      hitboxRef.current.getWorldPosition(currentPos);
      const distance = currentPos.distanceTo(BEAKER_POSITION);
      
      if (distance < 0.7) {
        triggerPour(flaskData.id);
      }
    }
  };

  return (
    <>
      <DragControls axisLock="y" onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <mesh ref={hitboxRef} position={[startX, -0.49, 0]} onPointerDown={(e) => { if (isPouring || isMixed) e.stopPropagation(); }} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          <boxGeometry args={[0.4, 0.8, 0.4]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </DragControls>

      <group ref={visualRef} position={[startX, -0.49, 0]} pointerEvents="none">
        <Flask scale={0.015} />
        {!isMixed && !isPouring && (
          <Html position={[0, 0.4, 0]} center>
            <div className={`chemical-label ${hovered ? 'hovered' : ''}`}>
              <div className="dot" style={{ backgroundColor: flaskData.color }}></div>
              {flaskData.label}
            </div>
          </Html>
        )}
      </group>
    </>
  );
}


export default function App() {
  const [isDragging, setIsDragging] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isMixed, resetKey, currentExp } = useLabStore();

  return (
    <div className="app-container">
      <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
        <Menu size={24} />
      </button>
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="canvas-wrapper">
        <ReactionModal />

        <Canvas camera={{ position: [0, 2, 4.5], fov: 45 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 10, 5]} intensity={2} castShadow tilt={Math.PI / 4} />
          <Environment preset="city" />

          <Suspense fallback={null}>
            <Table position={[0, -1, 0]} scale={1.5} rotation={[0, 4.7, 0]} />
            <Decorations />

            {/* The Beaker sits on the Burner now */}
            <group position={[-0.8, -0.43, 0]}>
              <Burner position={[0, 0, 0]} scale={3} />

              <Beaker position={[0, 0.6, 0]} scale={0.03} />

              {!isMixed && (
                <Html position={[0, 0.8, 0]} center zIndexRange={[100, 0]}>
                  <div className="chemical-label beaker-label">
                    <div className="dot beaker-dot"></div>
                    {currentExp.beakerLabel}
                  </div>
                </Html>
              )}
            </group>

            {currentExp.availableFlasks.map((flask, idx) => (
              <InteractiveFlask
                key={`${resetKey}-${flask.id}`}
                setIsDragging={setIsDragging}
                flaskData={flask}
                index={idx}
                total={currentExp.availableFlasks.length}
              />
            ))}

            <Bubbles />
          </Suspense>

          <ContactShadows position={[0, -0.99, 0]} opacity={0.4} scale={15} blur={2.5} far={4} color="#0f172a" />
          <OrbitControls makeDefault enabled={!isDragging} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2.1} minDistance={2.5} maxDistance={6} />
        </Canvas>
      </div>
    </div>
  );
}