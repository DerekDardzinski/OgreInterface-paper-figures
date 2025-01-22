'use client'

import { Box, Billboard, Text, Bounds, OrbitControls, Environment, View, PerspectiveCamera, Sphere, Html } from "@react-three/drei";
import { BaseLayout } from "@/components/BaseLayout/BaseLayout";
import { ThreeView } from "@/components/ThreeView/ThreeView";
import { useRef } from "react";
import { Graph } from 'graphology';
import { StructureView } from '@/components/Structure/Structure';
import { BasisVectors } from "@/components/BasisVectors/BasisVectors";

export default function TestPage(props) {
    const testFigure = require('../data/test_figure.json');
    const structureGraph = new Graph();
    structureGraph.import(testFigure.graphData);
    const mainCameraRef = useRef();
    const boxRef = useRef();
    const secondCameraRef = useRef();
    return (
        <BaseLayout pageTitle={"Test Figure"}>
            <div className="flex flex-row w-screen bg-base-100 gap-1 m-8">
                <div className="flex flex-col flex-grow bg-base-200">
                    <ThreeView cameraRef={mainCameraRef}>
                        {/* <Box>
                            <meshPhysicalMaterial attach="material" color="hotpink" />
                        </Box> */}

                        <Bounds fit clip observe margin={1.4}>
                            <StructureView
                                structureGraph={structureGraph}
                                bondCutoffs={testFigure.bondCutoffs}
                                unitCell={testFigure.unitCell}
                                basis={testFigure.basis}
                                recipBasis={testFigure.recipBasis}
                                normBasis={testFigure.normBasis}
                            />
                        </Bounds>
                    </ThreeView>
                </div>
                <div className="flex flex-col flex-shrik w-60 bg-base-200">
                    <div className="w-[100%] h-[100%] grid grid-rows-3 bg-red-100">
                        <div></div>
                        <div></div>
                        <div className="flex bg-blue-100" >

                            <ThreeView cameraRef={mainCameraRef} setInteractive={false}>
                                <Bounds fit clip observe margin={1.4}>
                                    <BasisVectors basis={testFigure.normBasis} />
                                    {/* <Box ref={boxRef}>
                                        <meshPhysicalMaterial attach="material" color="red" />
                                    </Box>

                                    <Billboard position={[2, 2, 0]} follow={true} lockX={false} lockY={false} lockZ={false} >

                                    <Text  color="black" anchorX="center" anchorY="middle">
                                        hello world!
                                    </Text>
                                    </Billboard> */}
                                </Bounds>
                                {/* <Html geometry={boxRef} position={[1, 0, 0]}>
                                    <span className="text-black">Test</span>
                                </Html> */}
                            </ThreeView>
                        </div>
                    </div>
                </div>
            </div>
        </BaseLayout>
        //     <div className="grid grid-cols-2 flex flex-grow gap-5 m-5">
        //         <div className="relative bg-green-100">
        //             <View className="absolute top-0 left-0 w-[100%] h-[100%]">
        //                 <ambientLight />
        //                 <Box>
        //                     <meshPhysicalMaterial attach="material" color="hotpink" />
        //                 </Box>
        //                 <Sphere position={[2, 0, 0]}>
        //                     <meshPhysicalMaterial attach="material" color="red" />
        //                 </Sphere>
        //                 <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />
        //                 <OrbitControls makeDefault />
        //                 <Environment preset="sunset" />
        //             </View>
        //         </div>
        //         <div className="grid grid-rows-2 gap-5">
        //             <div className="relative bg-purple-100">
        //                 <View className="absolute top-0 left-0 w-[100%] h-[100%]">
        //                     <ambientLight />
        //                     <Box>
        //                         <meshPhysicalMaterial attach="material" color="blue" />
        //                     </Box>
        //                     <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />
        //                     <OrbitControls makeDefault />
        //                     <Environment preset="sunset" />
        //                 </View>
        //             </div>
        //             <div className="relative bg-yellow-100">
        //                 <View className="absolute top-0 left-0 w-[100%] h-[100%]">
        //                     <ambientLight />
        //                     <Box>
        //                         <meshPhysicalMaterial attach="material" color="green" />
        //                     </Box>
        //                     <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />
        //                     <OrbitControls makeDefault />
        //                     <Environment preset="sunset" />
        //                 </View>
        //             </div>
        //         </div>
        //     </div>
    );
}
