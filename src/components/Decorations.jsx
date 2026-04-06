import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

export default function Decorations() {
  const pipetteRef = useGLTF('/models/pipette.glb');
  const thermoRef = useGLTF('/models/thermometer.glb');
  const rackRef = useGLTF('/models/tuberack.glb');

  const pipetteScene = useMemo(() => pipetteRef.scene.clone(), [pipetteRef]);
  const thermoScene = useMemo(() => thermoRef.scene.clone(), [thermoRef]);
  const rackScene = useMemo(() => rackRef.scene.clone(), [rackRef]);

  return (
    <group>
      <primitive
        object={rackScene}
        position={[-1.15, -0.4, -0.2]}
        scale={0.03}
        rotation={[0, Math.PI / 6, 0]}
      />
      <primitive
        object={thermoScene}
        position={[1.5, -0.485, 0.5]}
        scale={0.05}
        rotation={[Math.PI / 2, 0, Math.PI / 4]}
      />
      <primitive
        object={pipetteScene}
        position={[-1.2, -0.485, 0.8]}
        scale={0.05}
        rotation={[Math.PI / 2, 0, -Math.PI / 8]}
      />
    </group>
  );
}

useGLTF.preload('/models/pipette.glb');
useGLTF.preload('/models/thermometer.glb');
useGLTF.preload('/models/tuberack.glb');
