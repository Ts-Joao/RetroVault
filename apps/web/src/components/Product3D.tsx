"use client"

import { Canvas, useLoader } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { TextureLoader } from "three"

interface Product3DProps {
  front: string
  back: string
  spine: string
}

function Product({ front, back, spine }: Product3DProps) {

  const frontTexture = useLoader(TextureLoader, front)
  const backTexture = useLoader(TextureLoader, back)
  const spineTexture = useLoader(TextureLoader, spine)

  return (
    <mesh castShadow receiveShadow>

      <boxGeometry args={[2, 3, 0.25]} />
      <meshStandardMaterial map={spineTexture} />
      <meshStandardMaterial map={spineTexture} />
      <meshStandardMaterial color="#111" />
      <meshStandardMaterial color="#111" />
      <meshStandardMaterial map={frontTexture} />
      <meshStandardMaterial map={backTexture} />
      
    </mesh>
  )
}

export default function Product3D({ front, back, spine }: Product3DProps) {
  if (!front || !back || !spine) return null

  return (
    <Canvas
      shadows
      camera={{ position: [3, 2, 5], fov: 45 }}
      gl={{ antialias: true }}
      style={{ width: "100%", height: "100%" }}
    >

      <ambientLight intensity={0.5} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={1.5}
        castShadow
      />

      <Product
        front={front}
        back={back}
        spine={spine}
      />

      <OrbitControls
        autoRotate={false}
        enableZoom={true}
      />

    </Canvas>
  )
}
