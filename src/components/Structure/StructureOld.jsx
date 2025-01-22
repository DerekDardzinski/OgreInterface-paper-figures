import React, {
    useEffect,
    useState,
    useRef,
} from "react";
// import Display from "../Display/Display.jsx";
import { UnitCell } from "../UnitCell/UnitCell.jsx";
// import { BasisVectors } from "../BasisVectors/BasisVectors.jsx";
// import { GizmoHelper } from "../BasisVectors/GizmoHelper.jsx";
import * as THREE from "three";
// import uuid from "react-uuid";
import { v4 as uuid } from "uuid";
import Graph from "graphology";
import LatticePlane from "../LatticePlane/LatticePlane.jsx";
// import { Bounds, useBounds } from "../../utils/Bounds.jsx";
import {
    StructureGeometry,
    getViewGraph,
    getTranslationFromImage,
} from "./StructureHelpers.jsx"


export const StructureView = ({
    structureGraph,
    latticePlaneProps,
    cellBounds,
    bondCutoffs,
    basis,
    recipBasis,
    cellColor,
}) => {
    const [viewGraph, setViewGraph] = useState(new Graph());
    const [showAllUnitCells, setShowAllUnitCells] = useState(true)
    const groupRef = useRef(new THREE.Object3D());

    useEffect(() => {
        setViewGraph(
            getViewGraph({ structureGraph, bondCutoffs, basis, cellBounds })
        );
    }, [structureGraph, bondCutoffs, basis, cellBounds]);

    // const newCenterShift = getCenterShift({ basis: basis, bounds: cellBounds });
    const newCenterShift = [0.0, 0.0, 0.0];
    const structureRef = useRef();

    const mergedGeoms = StructureGeometry({
        viewGraph: viewGraph,
        bounds: cellBounds,
    });

    let unitCells;
    if (showAllUnitCells) {
        const tmpUnitCells = []
        for (
            let a = Math.sign(cellBounds.a[0]) * Math.floor(Math.abs(cellBounds.a[0]));
            a <= Math.ceil(cellBounds.a[1]) - 1;
            a++
        ) {
            for (
                let b = Math.sign(cellBounds.a[0]) * Math.floor(Math.abs(cellBounds.b[0]));
                b <= Math.ceil(cellBounds.b[1]) - 1;
                b++
            ) {
                for (
                    let c = Math.sign(cellBounds.c[0]) * Math.floor(Math.abs(cellBounds.c[0]));
                    c <= Math.ceil(cellBounds.c[1]) - 1;
                    c++
                ) {
                    tmpUnitCells.push(<UnitCell key={uuid()} basis={basis} color={cellColor} shift={getTranslationFromImage({ basis: basis, image: [a, b, c] })} />)
                }
            }
        }
        unitCells = tmpUnitCells
    } else {
        unitCells = [<UnitCell key={uuid()} basis={basis} shift={[0.0, 0.0, 0.0]} color={cellColor} />]
    }

    return (
        <>
            {structureGraph.order > 0 ? (
                <>
                    <group ref={groupRef} position={newCenterShift}>
                        <mesh
                            key={uuid()}
                            ref={structureRef}
                            geometry={mergedGeoms}
                            material={
                                new THREE.MeshPhysicalMaterial({
                                    vertexColors: true,
                                    roughness: 0.5,
                                    metalness: 0.7,

                                })
                            }
                        />
                        {Object.keys(latticePlaneProps).length > 0 ? (
                            Object.keys(latticePlaneProps).map((key, index) => {
                                return (
                                    <LatticePlane
                                        key={uuid()}
                                        basis={basis}
                                        recipBasis={recipBasis}
                                        cellBounds={cellBounds}
                                        centerShift={newCenterShift}
                                        {...latticePlaneProps[key]}
                                    />
                                );
                            })
                        ) : (
                            <></>
                        )}
                        {unitCells}
                    </group>
                </>
            ) : (
                <></>
            )}
        </>
    );
}

StructureView.defaultProps = {
	latticePlaneProps: [],
	cellBounds: { a: [0, 1], b: [0, 1], c: [0, 1] },
};