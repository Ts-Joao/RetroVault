"use client"

import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three";

function Box() {

    const front = useLoader(TextureLoader, "/image/front.jpg")
    const back = useLoader(TextureLoader, "/image/back.jpg")
    const spine = useLoader(TextureLoader, "/image/spine.jpg")

    return (
        <mesh>
            <boxGeometry args={[2, 3, 0.2]} />
            <meshStandardMaterial map={spine} />

            <meshStandardMaterial map={spine} />

            <meshStandardMaterial color="#111" />

            <meshStandardMaterial color="#111" />

            <meshStandardMaterial map={front} />

            <meshStandardMaterial map={back} />

        </mesh>
    )
}

export default function GameBox3D() {
    return (
        <div className="w-[400px] h-[400px]">
            <Canvas camera={{ position: [3, 2, 5], fov: 50 }}>
                <ambientLight intensity={1} />
                <directionalLight position={[5, 5, 5]} />

                <Box />

                <OrbitControls enableZoom={true} />
            </Canvas>
        </div>
    )
}