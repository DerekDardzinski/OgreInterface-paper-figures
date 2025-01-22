"use client";

import {
    View,
    PerspectiveCamera,
    OrthographicCamera,
    OrbitControls,
    Environment,
    Stage,
    ContactShadows,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

const CameraTracker = ({ cameraRef }) => {
    useFrame(({camera}) => {
        // console.log(cameraRef.current)
        const currentRadius = camera.position.length()
        const newPosition = cameraRef.current.position.clone().normalize().multiplyScalar(currentRadius)
        camera.position.copy(newPosition)
        // camera.zoom = cameraRef.current.zoom
        camera.lookAt(0, 0, 0)
        camera.updateProjectionMatrix()
    
    });
}

export const ThreeView = ({cameraRef, setInteractive = true, ...props}) => {
    return (
        <View
            className="flex flex-grow"
        >
            {props.children}
            {
                setInteractive ? (
                    <>
                        <OrbitControls makeDefault/>
                        <OrthographicCamera
                            ref={cameraRef}
                            makeDefault
                            position={[0, 0, 10]}
                            zoom={40}
                        >
                            <directionalLight intensity={1.25} />
                        </OrthographicCamera>
                        
                        {/* <PerspectiveCamera
                            ref={cameraRef}
                            makeDefault
                            position={[0, 0, 10]}
                            fov={40}
                        >
                            <directionalLight intensity={1.25} />
                        </PerspectiveCamera> */}
                    </>
                )
                    : (
                        <>
                        <OrthographicCamera
                            makeDefault
                            position={[0, 0, 10]}
                            zoom={70}
                            // fov={40}
                        >
                            <directionalLight intensity={1.25} />
                        </OrthographicCamera>
                        {/* <PerspectiveCamera
                            makeDefault
                            position={[0, 0, 10]}
                            fov={40}
                        >
                            <directionalLight intensity={1.25} />
                        </PerspectiveCamera> */}
                        <CameraTracker cameraRef={cameraRef} />
                        </>
                    )
            }
            <Environment preset="sunset" />
        </View>
    );
};
