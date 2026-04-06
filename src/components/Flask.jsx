import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Flask(props) {
  const { nodes, materials } = useGLTF('/models/flask.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Object_4.geometry} material={materials.Material} scale={6.637} />
      <mesh geometry={nodes.Object_6.geometry} material={materials['582896-removebg-preview']} position={[0, 6.38, 6.08]} rotation={[Math.PI / 2, 0, 0]} scale={[6.755, 6.755, 9.376]} />
      <mesh geometry={nodes.Object_8.geometry} material={materials['8985874-removebg-preview']} position={[7.451, 4.799, 1.754]} rotation={[1.591, -0.115, -1.51]} scale={3.335} />
    </group>
  )
}
useGLTF.preload('/models/flask.glb')