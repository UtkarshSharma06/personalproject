import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, ContactShadows, PerspectiveCamera, Environment } from '@react-three/drei';
import { Loader2 } from 'lucide-react';

interface ModelCanvasProps {
    children: React.ReactNode;
    environmentType?: 'biology' | 'chemistry' | 'physics' | 'math' | 'space';
}

export const ModelCanvas = ({ children, environmentType = 'space' }: ModelCanvasProps) => {
    const bgColor = environmentType === 'biology' ? '#f8fafc' :
        environmentType === 'chemistry' ? '#0f172a' :
            environmentType === 'physics' ? '#020617' : '#020617';

    return (
        <div className="w-full h-full relative bg-[#020617] rounded-3xl lg:rounded-[3rem] overflow-hidden">
            <Suspense fallback={
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-md z-50">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                </div>
            }>
                <Canvas shadows camera={{ position: [0, 5, 12], fov: 45 }}>
                    <color attach="background" args={[bgColor]} />
                    {environmentType === 'space' && <fog attach="fog" args={[bgColor, 5, 25]} />}

                    <ambientLight intensity={environmentType === 'biology' ? 0.7 : 0.5} />
                    <pointLight position={[10, 10, 10]} intensity={2} castShadow />
                    <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />

                    {children}

                    <ContactShadows position={[0, -4.5, 0]} opacity={0.6} scale={20} blur={2.4} far={4.5} />
                    <OrbitControls makeDefault enableZoom={true} enablePan={true} />
                    {environmentType === 'space' && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
                    {environmentType === 'biology' ? (
                        <Environment preset="warehouse" />
                    ) : (
                        <Environment preset="city" />
                    )}

                    {environmentType === 'biology' && (
                        <gridHelper args={[20, 20, '#cbd5e1', '#f1f5f9']} position={[0, -4.51, 0]} />
                    )}
                </Canvas>
            </Suspense>
        </div>
    );
};
