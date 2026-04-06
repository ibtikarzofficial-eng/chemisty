import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Table(props) {
  const { nodes, materials } = useGLTF('/models/table.glb')
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh geometry={nodes.defaultMaterial.geometry} material={materials.blinn1} />
          <mesh geometry={nodes.defaultMaterial_1.geometry} material={materials.blinn1} />
          <mesh geometry={nodes.defaultMaterial_2.geometry} material={materials.blinn1} />
          <mesh geometry={nodes.defaultMaterial_3.geometry} material={materials.blinn1} />
          <mesh geometry={nodes.defaultMaterial_4.geometry} material={materials.blinn1} />
          <mesh geometry={nodes.defaultMaterial_5.geometry} material={materials.blinn1} />
          <mesh geometry={nodes.defaultMaterial_6.geometry} material={materials.blinn1} />
          <mesh geometry={nodes.defaultMaterial_7.geometry} material={materials.blinn1} />
          <mesh geometry={nodes.defaultMaterial_8.geometry} material={materials.blinn1} />
          <mesh geometry={nodes.defaultMaterial_9.geometry} material={materials.lambert1} />
          <mesh geometry={nodes.defaultMaterial_10.geometry} material={materials.blinn2} />
        </group>
      </group>
    </group>
  )
}
useGLTF.preload('/models/table.glb')