import { v4 as uuid } from "uuid";
import Graph from "graphology";
import LatticePlane from "../LatticePlane/LatticePlane.jsx";
import { StructureGeometry, UnitCell } from "./StructureHelpers.jsx";
import { forwardRef, useRef } from "react";
import { LatticeVector } from "../LatticeVector/LatticeVector.jsx";

export const Structure = forwardRef(({
  graph = new Graph(),
  showAtoms = false,
  showBonds = false,
  showUnitCell = false,
  latticePlaneProps = [],
  latticeVectorProps = [],
  basis = [
    [1.0, 0.0, 0.0],
    [0.0, 1.0, 0.0],
    [0.0, 0.0, 1.0],
  ],
  recipBasis = [
    [1.0, 0.0, 0.0],
    [0.0, 1.0, 0.0],
    [0.0, 0.0, 1.0],
  ],
  cellBounds = { a: [0.0, 1.0], b: [0.0, 1.0], c: [0.0, 1.0] },
  unitCellProps = { color: "darkgrey", radius: 0.05 },
  shift = [0.0, 0.0, 0.0],
  bondCutoffs = {},
  alpha = 1.0,
}, ref) => {
  const structureRef = useRef();
  console.log(ref)
  return (
    <group ref={structureRef} position={shift}>
      <StructureGeometry
        ref={ref}
        graph={graph}
        showAtoms={showAtoms}
        showBonds={showBonds}
        basis={basis}
        cellBounds={cellBounds}
        bondCutoffs={bondCutoffs}
        alpha={alpha}
      />
      {latticePlaneProps.length > 0 ? (
        latticePlaneProps.map((planeProps, index) => (
          <LatticePlane
            key={uuid()}
            basis={basis}
            recipBasis={recipBasis}
            centerShift={shift}
            {...planeProps}
          />
        ))
      ) : (
        <></>
      )}
      {showUnitCell ? <UnitCell basis={basis} {...unitCellProps} /> : <></>}
      {latticeVectorProps.length > 0 ? (
        latticeVectorProps.map((vectorProps, index) => (
        <LatticeVector key={uuid()} basis={basis} {...vectorProps} />
        ))
      ) : (
        <></>
      )}
    </group>
  );
});
