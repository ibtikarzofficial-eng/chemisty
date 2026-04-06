import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Beaker(props) {
  const { nodes, materials } = useGLTF('/models/beaker.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Object_4.geometry} material={materials.Material} position={[0, 0.331, 0]} scale={2.95} />
      <mesh geometry={nodes.Object_6.geometry} material={materials['Material.004']} position={[0, 4.351, 3.515]} rotation={[Math.PI / 2, 0, 0]} scale={[2.868, 0.781, 3.122]} />
    </group>
  )
}
useGLTF.preload('/models/beaker.glb')