"use client";

import {
    Box,
    Billboard,
    Text,
    Bounds,
    OrbitControls,
    Environment,
    View,
    PerspectiveCamera,
    Sphere,
    Html,
} from "@react-three/drei";
import { BaseLayout } from "@/components/BaseLayout/BaseLayout";
import { ThreeView } from "@/components/ThreeView/ThreeView";
import { useRef } from "react";
import { Graph } from "graphology";
import { StructureView } from "@/components/Structure/Structure";
import { BasisVectors } from "@/components/BasisVectors/BasisVectors";
import LatticePlane from "@/components/LatticePlane/LatticePlane";
import { UnitCellPoints } from "@/components/UnitCell/UnitCell";
import { v4 as uuid } from "uuid";

export default function TestPage(props) {
    const testFigure1 = require("../data/test_figure.json");
    const testFigure2 = require("../data/test_figure_Al.json");
    const structureGraph = new Graph();
    structureGraph.import(testFigure1.graphData);
    const structureGraphAl = new Graph();
    structureGraphAl.import(testFigure2.graphData);
    const mainCameraRef = useRef();
    const boxRef = useRef();
    const secondCameraRef = useRef();

    const latticePlaneProps = [
        {millerIndex: [1, 0, 0], shiftAlongNorm: 0.0},
        {millerIndex: [-1, 0, 0], shiftAlongNorm: -1.0},
        {millerIndex: [0, 1, 0], shiftAlongNorm: 0.0},
        {millerIndex: [0, -1, 0], shiftAlongNorm: -1.0},
        {millerIndex: [0, 0, 1], shiftAlongNorm: 0.0},
        {millerIndex: [0, 0, -1], shiftAlongNorm: -1.0},
    ]

    const LatticePlanes1 = latticePlaneProps.map((props, index) => {
        return (
            <LatticePlane
                key={uuid()}
                basis={testFigure1.basis}
                recipBasis={testFigure1.recipBasis}
                {...props}
                color="red"
                alpha={0.15}
            />
        )
    }) 

    const LatticePlanes2 = latticePlaneProps.map((props, index) => {
        return (
            <LatticePlane
                key={uuid()}
                basis={testFigure2.basis}
                recipBasis={testFigure2.recipBasis}
                {...props}
                color="blue"
                alpha={0.45}
            />
        )
    }) 

    return (
        <BaseLayout pageTitle={"Test Figure"}>
            <div className="relative flex flex-row w-screen bg-base-100 gap-1 m-8">
                <ThreeView cameraRef={mainCameraRef}>
                    {/* <Box>
                            <meshPhysicalMaterial attach="material" color="hotpink" />
                        </Box> */}

                    {LatticePlanes1}
                    {LatticePlanes2}
                    <StructureView
                        key={0}
                        structureGraph={structureGraph}
                        bondCutoffs={testFigure1.bondCutoffs}
                        unitCell={testFigure1.unitCell}
                        basis={testFigure1.basis}
                        recipBasis={testFigure1.recipBasis}
                        normBasis={testFigure1.normBasis}
                        cellColor={"red"}
                    />
                    <StructureView
                        key={1}
                        structureGraph={structureGraphAl}
                        bondCutoffs={testFigure2.bondCutoffs}
                        unitCell={testFigure2.unitCell}
                        basis={testFigure2.basis}
                        recipBasis={testFigure2.recipBasis}
                        normBasis={testFigure2.normBasis}
                        cellColor={"blue"}
                    />
                    <Bounds fit clip margin={1.4}>
                        <UnitCellPoints basis={testFigure1.basis} />
                        <UnitCellPoints basis={testFigure2.basis} />
                    </Bounds>
                </ThreeView>
                <div className="absolute h-80 bottom-0 right-0 w-[100%] md:w-80 md:h-[100%] bg-red-300">
                    <div className="w-[100%] h-[100%] grid grid-cols-2 grid-rows-1 md:grid-cols-1 md:grid md:grid-rows-2 bg-purple-100">
                    {/* <div className="w-[100%] h-[100%] flex flex-col md:flex-row ws-3 bg-purple-100"> */}
                        {/* <div className="bg-yellow-200"></div> */}
                        <div className="flex bg-green-200">
                            <ThreeView cameraRef={mainCameraRef} setInteractive={false}>
                                <BasisVectors basis={testFigure1.normBasis} />
                                {/* <Bounds fit clip observe margin={1.0}>
                                    <Sphere position={[0, 0, 0]} args={[2.0, 10, 10]} visible={false} />
                                </Bounds> */}
                            </ThreeView>
                        </div>
                        <div className="flex bg-blue-100">
                            <ThreeView cameraRef={mainCameraRef} setInteractive={false}>
                                <BasisVectors basis={testFigure2.normBasis} />
                                {/* <Bounds fit clip observe margin={1.0}>
                                    <Sphere position={[0, 0, 0]} args={[2.0, 10, 10]} visible={false} />
                                </Bounds> */}
                            </ThreeView>
                        </div>
                    </div>
                </div>
                {/* <div className="flex flex-col flex-grow bg-base-200">
                </div>
                <div className="flex flex-col flex-shrik w-60 bg-base-200 absolute left-0 top-0 width-60 height-60">
                    <div className="w-[100%] h-[100%] grid grid-rows-3 bg-red-100">
                        <div></div>
                        <div></div>
                        <div className="flex bg-blue-100" >
                            <ThreeView cameraRef={mainCameraRef} setInteractive={false}>
                                <Bounds fit clip observe margin={1.4}>
                                    <BasisVectors basis={testFigure.normBasis} />
                                </Bounds>
                            </ThreeView>
                        </div>
                    </div>
                </div> */}
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
