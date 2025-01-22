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
};

const Panel = ({
  cellColor = "red",
  planeAlpha = 0.2,
  cellBounds = { a: [0.0, 1.0], b: [0.0, 1.0], c: [0.0, 1.0] },
  structureGraph1 = new Graph(),
  structureGraph2 = new Graph(),
  structureData1 = {},
  structureData2 = {},
}) => {
  const latticePlaneProps = [
    {
      millerIndex: [1, 0, 0],
      shiftAlongNorm: 0.0,
      color: cellColor,
      alpha: planeAlpha,
    },
    {
      millerIndex: [-1, 0, 0],
      shiftAlongNorm: -1.0,
      color: cellColor,
      alpha: planeAlpha,
    },
    {
      millerIndex: [0, 1, 0],
      shiftAlongNorm: 0.0,
      color: cellColor,
      alpha: planeAlpha,
    },
    {
      millerIndex: [0, -1, 0],
      shiftAlongNorm: -1.0,
      color: cellColor,
      alpha: planeAlpha,
    },
    {
      millerIndex: [0, 0, 1],
      shiftAlongNorm: 0.0,
      color: cellColor,
      alpha: planeAlpha,
    },
    {
      millerIndex: [0, 0, -1],
      shiftAlongNorm: -1.0,
      color: cellColor,
      alpha: planeAlpha,
    },
  ];

  const boundsRef = useRef();
  const mainCameraRef = useRef();

  return (
    <div className="relative flex flex-col grow bg-red-100">
      <ThreeView cameraRef={mainCameraRef}>
        <Bounds>
          <BoundsAdjuster objRef={boundsRef} />
        </Bounds>

        {/* <Structure
          key={uuid()}
          ref={boundsRef}
          graph={structureGraph1}
          showAtoms
          showBonds
          cellBounds={cellBounds}
          alpha={1.0}
          {...structureData1}
        /> */}
        <Structure
          key={uuid()}
          ref={boundsRef}
          graph={structureGraph2}
          showUnitCell
          showAtoms
          showBonds
          latticePlaneProps={latticePlaneProps}
          unitCellProps={{ color: cellColor, radius: 0.05 }}
          {...structureData2}
        />
      </ThreeView>
      <div className="flex absolute h-80 bottom-0 right-0 w-[100%] bg-red-300">
        <ThreeView cameraRef={mainCameraRef} setInteractive={false}>
          <BasisVectors basis={structureData2.normBasis} />
        </ThreeView>
      </div>
    </div>
  );
};

export default function TestPage(props) {
  const dataConv = require("../data/conv.json");
  const graphConv = new Graph();
  graphConv.import(dataConv.graphData);

  const data001 = require("../data/obs_001.json");
  const graph001 = new Graph();
  graph001.import(data001.graphData);

  const data110 = require("../data/obs_110.json");
  const graph110 = new Graph();
  graph110.import(data110.graphData);

  const data111 = require("../data/obs_111.json");
  const graph111 = new Graph();
  graph111.import(data111.graphData);

  const cellColor = "blue";
  const planeAlpha = 0.4;

  return (
    <BaseLayout pageTitle={"Test Figure"}>
      <div className="relative flex flex-row w-screen bg-base-200 gap-1 m-8">
        <Panel
          cellColor={cellColor}
          planeAlpha={planeAlpha}
          structureGraph1={graphConv}
          structureData1={dataConv}
          structureGraph2={graph001}
          structureData2={data001}
        />
        
        <Panel
          cellColor={cellColor}
          planeAlpha={planeAlpha}
          structureGraph1={graphConv}
          structureData1={dataConv}
          structureGraph2={graph110}
          structureData2={data110}
        />
        
        <Panel
          cellColor={cellColor}
          planeAlpha={planeAlpha}
          structureGraph1={graphConv}
          structureData1={dataConv}
          structureGraph2={graph111}
          structureData2={data111}
        />
      </div>
    </BaseLayout>
  );
}
