"use client";
import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";
function Orb() { return <Float speed={0.45} rotationIntensity={0.15} floatIntensity={0.25}><mesh position={[2.5, 1, -1]}><icosahedronGeometry args={[0.8, 1]} /><meshBasicMaterial color="#77c7e8" wireframe transparent opacity={0.11} /></mesh></Float>; }
export default function AmbientCanvas() { return <Canvas aria-hidden className="ambient-canvas" dpr={[1, 1.5]} frameloop="demand" camera={{ position: [0,0,6] }}><Orb /></Canvas>; }
