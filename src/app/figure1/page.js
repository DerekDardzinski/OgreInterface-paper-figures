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
    Center,
    useBounds,
} from "@react-three/drei";
import { BaseLayout } from "@/components/BaseLayout/BaseLayout";
import { ThreeView } from "@/components/ThreeView/ThreeView";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Graph } from "graphology";
import { Structure, StructureView } from "@/components/Structure/Structure";
import { BasisVectors } from "@/components/BasisVectors/BasisVectors";
import LatticePlane from "@/components/LatticePlane/LatticePlane";
import { UnitCellPoints } from "@/components/UnitCell/UnitCell";
import { v4 as uuid } from "uuid";
import { useThree } from "@react-three/fiber";
import * as mathjs from "mathjs";

const BoundsAdjuster = ({ objRef }) => {
    const bounds = useBounds();
    const { size } = useThree();

    useLayoutEffect(() => {
        bounds.refresh(objRef.current).reset().clip().fit();
    }, [size, bounds, objRef]);
}

export default function TestPage(props) {
    const testFigure1 = require("../data/test_figure.json");
    const testFigure2 = require("../data/test_figure_Al.json");

    const structureGraph1 = new Graph();
    structureGraph1.import(testFigure1.graphData);

    const structureGraph2 = new Graph();
    structureGraph2.import(testFigure2.graphData);

    const color1 = "red"
    const color2 = "blue"
    
    // const color1 = "#2c2c2c"
    // const color2 = "#2c2c2c"

    const alpha1 = 0.40
    const alpha2 = 0.40

    const mainCameraRef = useRef();

    const latticePlaneProps1 = [
        {millerIndex: [1, 0, 0], shiftAlongNorm: 0.0, color: color1, alpha: alpha1},
        {millerIndex: [-1, 0, 0], shiftAlongNorm: -1.0, color: color1, alpha: alpha1},
        {millerIndex: [0, 1, 0], shiftAlongNorm: 0.0, color: color1, alpha: alpha1},
        {millerIndex: [0, -1, 0], shiftAlongNorm: -1.0, color: color1, alpha: alpha1},
        {millerIndex: [0, 0, 1], shiftAlongNorm: 0.0, color: color1, alpha: alpha1},
        {millerIndex: [0, 0, -1], shiftAlongNorm: -1.0, color: color1, alpha: alpha1},
    ]

    const latticeVectorProps = [
        // {uvw: [1, 0, 0], color: "red", radius: 0.2},
        // {uvw: [0, 1, 0], color: "green", radius: 0.2},
        // {uvw: [0, 0, 1], color: "blue", radius: 0.2},
    ]
    
    const latticePlaneProps2 = [
        {millerIndex: [1, 0, 0], shiftAlongNorm: 0.0, color: color2, alpha: alpha2},
        {millerIndex: [-1, 0, 0], shiftAlongNorm: -1.0, color: color2, alpha: alpha2},
        {millerIndex: [0, 1, 0], shiftAlongNorm: 0.0, color: color2, alpha: alpha2},
        {millerIndex: [0, -1, 0], shiftAlongNorm: -1.0, color: color2, alpha: alpha2},
        {millerIndex: [0, 0, 1], shiftAlongNorm: 0.0, color: color2, alpha: alpha2},
        {millerIndex: [0, 0, -1], shiftAlongNorm: -1.0, color: color2, alpha: alpha2},
    ]

    const ref1 = useRef();
    console.log("ref 1 = ", ref1.current);

    return (
        <BaseLayout pageTitle={"Test Figure"}>
            <div className="relative flex flex-row w-screen bg-base-100 gap-1 m-8">
                <ThreeView cameraRef={mainCameraRef}>
                    {/* <Bounds fit clip observe margin={1.4}> */}
                    <Bounds>
                        <BoundsAdjuster objRef={ref1} />
                    </Bounds>
                    {/* <Center> */}

                    <Structure 
                        key={uuid()}
                        ref={ref1}
                        graph={structureGraph1}
                        // showUnitCell
                        showAtoms
                        showBonds
                        // latticePlaneProps={latticePlaneProps1}
                        unitCellProps={{color: color1, radius: 0.05}}
                        cellBounds={{a : [0.0, 1.0], b : [0.0, 3.0], c: [0.0, 1.0]}}
                        alpha={1.0}
                        {...testFigure1}
                    />
                    <Structure 
                        key={uuid()}
                        shift={mathjs.multiply(testFigure1.basis[1], 2)}
                        graph={structureGraph1}
                        showUnitCell
                        // showAtoms
                        // showBonds
                        latticePlaneProps={latticePlaneProps1}
                        latticeVectorProps={latticeVectorProps}
                        unitCellProps={{color: color1, radius: 0.05}}
                        {...testFigure1}
                    />
                    <Structure 
                        key={uuid()}
                        graph={structureGraph2}
                        showUnitCell
                        // showAtoms
                        // showBonds
                        latticePlaneProps={latticePlaneProps2}
                        latticeVectorProps={latticeVectorProps}
                        unitCellProps={{color: color2, radius: 0.05}}
                        {...testFigure2}
                    />
                    {/* </Center> */}
                </ThreeView>
                <div className="absolute h-80 bottom-0 right-0 w-[100%] md:w-80 md:h-[100%] bg-red-300">
                    <div className="w-[100%] h-[100%] flex flex-row md:flex-col ws-3 bg-purple-100">
                        <div className="shrink w-[100%] h-[100%] bg-red-200"></div>
                        <div className="flex flex-none w-80 md:h-80 bg-green-200">
                            <ThreeView cameraRef={mainCameraRef} setInteractive={false}>
                                <BasisVectors basis={testFigure1.normBasis} />
                            </ThreeView>
                        </div>
                        <div className="flex flex-none w-80 md:h-80 bg-blue-200">
                            <ThreeView cameraRef={mainCameraRef} setInteractive={false}>
                                <BasisVectors basis={testFigure2.normBasis} />
                            </ThreeView>
                        </div>
                        <div className="shrink w-[100%] h-[100%] bg-orange-200"></div>
                    </div>
                    {/* <div className="w-[100%] h-[100%] grid grid-cols-2 grid-rows-1 md:grid-cols-1 md:grid md:grid-rows-2 bg-purple-100">
                        <div className="flex bg-green-200 h-80">
                            <ThreeView cameraRef={mainCameraRef} setInteractive={false}>
                                <BasisVectors basis={testFigure1.normBasis} />
                            </ThreeView>
                        </div>
                        <div className="flex bg-blue-100 h-80">
                            <ThreeView cameraRef={mainCameraRef} setInteractive={false}>
                                <BasisVectors basis={testFigure2.normBasis} />
                            </ThreeView>
                        </div>
                    </div> */}
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
