import React, { forwardRef, useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import * as mathjs from "mathjs";
import Graph from "graphology";
import { v4 as uuid } from "uuid";
// import { Bounds, useBounds } from "../../utils/Bounds.jsx";

export const getImagePosition = ({ position, basis, image }) => {
  const translatedPosition = new THREE.Vector3().fromArray(position);
  const aVec = new THREE.Vector3().fromArray(basis[0]);
  const bVec = new THREE.Vector3().fromArray(basis[1]);
  const cVec = new THREE.Vector3().fromArray(basis[2]);
  translatedPosition.add(aVec.multiplyScalar(image[0]));
  translatedPosition.add(bVec.multiplyScalar(image[1]));
  translatedPosition.add(cVec.multiplyScalar(image[2]));

  return translatedPosition;
};

export const getAtom = ({ radius, position, color }) => {
  const atom = new THREE.SphereGeometry(radius, 32, 32);
  atom.translate(...position);
  const nVertices = atom.getAttribute("position").count;
  const rgb = new THREE.Color(color).toArray();
  const colorArray = new Array(nVertices).fill(rgb).flat();
  const colorAttribute = new THREE.BufferAttribute(
    new Float32Array(colorArray),
    3
  );
  atom.setAttribute("color", colorAttribute);

  return atom;
};

export const getBond = ({ toPosition, fromPosition, color, radius = 0.15 }) => {
  let toPositionVec = new THREE.Vector3().fromArray(toPosition);
  let fromPositionVec = new THREE.Vector3().fromArray(fromPosition);
  let bondVector = new THREE.Vector3().subVectors(
    toPositionVec,
    fromPositionVec
  );
  let normBondVector = new THREE.Vector3()
    .add(bondVector)
    .divideScalar(bondVector.length());
  let initOrientation = new THREE.Vector3().fromArray([0.0, 1.0, 0.0]);
  let bondCenter = new THREE.Vector3()
    .addVectors(toPositionVec, fromPositionVec)
    .multiplyScalar(0.5);
  let quat = new THREE.Quaternion().setFromUnitVectors(
    initOrientation,
    normBondVector
  );
  const bond = new THREE.CylinderGeometry(
    radius,
    radius,
    bondVector.length(),
    32,
    1,
    true
  );
  bond.applyQuaternion(quat);
  bond.translate(bondCenter);
  const nVertices = bond.getAttribute("position").count;
  const rgb = new THREE.Color(color).toArray();
  const colorArray = new Array(nVertices).fill(rgb).flat();
  const colorAttribute = new THREE.BufferAttribute(
    new Float32Array(colorArray),
    3
  );
  bond.setAttribute("color", colorAttribute);

  return bond;
};

export const UnitCell = ({
  basis = [
    [1.0, 0.0, 0.0],
    [0.0, 1.0, 0.0],
    [0.0, 0.0, 1.0],
  ],
  shift = [0, 0, 0],
  color = "red",
  radius = 0.05,
}) => {
  const ref = useRef();
  const materialProps = {
    vertexColors: true,
    roughness: 0.5,
    metalness: 0.7,
  };

  const geometry = useMemo(() => {
    const edgeProps = [
      {
        fromPosition: shift,
        toPosition: mathjs.add(shift, basis[0]),
        color: color,
      },
      {
        fromPosition: shift,
        toPosition: mathjs.add(shift, basis[1]),
        color: color,
      },
      {
        fromPosition: shift,
        toPosition: mathjs.add(shift, basis[2]),
        color: color,
      },
      {
        fromPosition: mathjs.add(shift, basis[0]),
        toPosition: mathjs.add(shift, basis[0], basis[1]),
        color: color,
      },
      {
        fromPosition: mathjs.add(shift, basis[0]),
        toPosition: mathjs.add(shift, basis[0], basis[2]),
        color: color,
      },
      {
        fromPosition: mathjs.add(shift, basis[1]),
        toPosition: mathjs.add(shift, basis[1], basis[2]),
        color: color,
      },
      {
        fromPosition: mathjs.add(shift, basis[1]),
        toPosition: mathjs.add(shift, basis[1], basis[0]),
        color: color,
      },
      {
        fromPosition: mathjs.add(shift, basis[2]),
        toPosition: mathjs.add(shift, basis[2], basis[0]),
        color: color,
      },
      {
        fromPosition: mathjs.add(shift, basis[2]),
        toPosition: mathjs.add(shift, basis[2], basis[1]),
        color: color,
      },
      {
        fromPosition: mathjs.add(shift, basis[0], basis[1]),
        toPosition: mathjs.add(shift, basis[0], basis[1], basis[2]),
        color: color,
      },
      {
        fromPosition: mathjs.add(shift, basis[0], basis[2]),
        toPosition: mathjs.add(shift, basis[0], basis[1], basis[2]),
        color: color,
      },
      {
        fromPosition: mathjs.add(shift, basis[1], basis[2]),
        toPosition: mathjs.add(shift, basis[0], basis[1], basis[2]),
        color: color,
      },
    ];

    const cornerProps = [
      { position: shift, color: color },
      { position: mathjs.add(shift, basis[0]), color: color },
      { position: mathjs.add(shift, basis[1]), color: color },
      { position: mathjs.add(shift, basis[2]), color: color },
      { position: mathjs.add(shift, basis[0], basis[1]), color: color },
      { position: mathjs.add(shift, basis[0], basis[2]), color: color },
      { position: mathjs.add(shift, basis[1], basis[2]), color: color },
      {
        position: mathjs.add(shift, basis[0], basis[1], basis[2]),
        color: color,
      },
    ];

    const geoms = [];

    const corners = cornerProps.map((cornerProps, index) =>
      getAtom({
        radius: radius,
        ...cornerProps,
      })
    );
    geoms.push(...corners);

    const edges = edgeProps.map((edgeProps, index) => getBond({ radius: radius, ...edgeProps }));
    geoms.push(...edges);

    const mergedGeoms = BufferGeometryUtils.mergeGeometries(geoms);
    return mergedGeoms;
  }, [basis, shift, color, radius]);

  return (
    <mesh
      key={uuid()}
      ref={ref}
      geometry={geometry}
      material={new THREE.MeshPhysicalMaterial({ ...materialProps })}
    />
  );
};

export const graphGeometries = ({
  graph = new Graph(),
  shift = [0.0, 0.0, 0.0],
}) => {
  const geoms = {
    atoms: [],
    bonds: [],
  };
  graph.forEachNode((node, attributes) => {
    const neighborInCell = graph.filterNeighbors(
      node,
      (node, attr) => attr.inCell
    );
    if (attributes.inCell | (neighborInCell.length > 0)) {
      if (attributes.motifType === "atom") {
        const atom = getAtom({
          radius: attributes.motif.radius,
          position: mathjs.add(attributes.position, shift),
          color: attributes.motif.color,
        });
        geoms.atoms.push(atom);
      } else if (attributes.motifType == "molecule") {
        const molecule = graphGeometries({
          graph: attributes.motif,
          shift: attributes.position,
        });
        geoms.atoms.push(...molecule.atoms);
        geoms.bonds.push(...molecule.bonds);
      }
    }
  });

  graph.forEachEdge(
    (edge, attributes, source, target, sourceAttributes, targetAttributes) => {
      if (sourceAttributes.inCell | targetAttributes.inCell) {
        attributes.bonds.forEach((bondProps, index) => {
          const bond = getBond({
            toPosition: mathjs.add(bondProps.toPosition, shift),
            fromPosition: mathjs.add(bondProps.fromPosition, shift),
            color: bondProps.color,
          });
          geoms.bonds.push(bond);
        });
      }
    }
  );

  return geoms;
};

export const StructureGeometry = forwardRef(({
  graph = new Graph(),
  bondCutoffs = {},
  basis = [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]],
  cellBounds = {a: [0.0, 1.0], b: [0.0, 1.0], c: [0.0, 1.0]},
  showAtoms = true,
  showBonds = true,
  shift = [0.0, 0.0, 0.0],
  alpha = 1.0,
  ...props
}, ref) => {
  const atomRef = useRef();
  const bondRef = useRef();

  const geometries = useMemo(() => {
    const viewGraph = getViewGraph({ structureGraph: graph, bondCutoffs: bondCutoffs, basis: basis, cellBounds: cellBounds })
    const geometryData = graphGeometries({ graph: viewGraph, shift: shift });
    const allGeometries = []

    if ((geometryData.atoms.length > 0) && showAtoms) {
      allGeometries.push(...geometryData.atoms)
    }
    
    if ((geometryData.bonds.length > 0) && showBonds) {
      allGeometries.push(...geometryData.bonds)
    }

    const mergedGeometries = (allGeometries.length > 0 ? BufferGeometryUtils.mergeGeometries(allGeometries) : new THREE.BufferGeometry());

    return mergedGeometries;
  }, [graph, shift, cellBounds, basis, bondCutoffs, showAtoms, showBonds]);

  const materialProps = {
    vertexColors: true,
    roughness: 0.5,
    metalness: 0.7,
    opacity: alpha,
    transparent: alpha < 1.0,
    depthWrite: true,
    side: THREE.FrontSide,
  };

  return (
    <group ref={ref}>
        <mesh
          key={uuid()}
          ref={atomRef}
          geometry={geometries}
          material={new THREE.MeshPhysicalMaterial(materialProps)}
          castShadow
        />
    </group>
  );
});


export const StructureGeometryBondAtom = forwardRef(({
  graph = new Graph(),
  bondCutoffs = {},
  basis = [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]],
  cellBounds = {a: [0.0, 1.0], b: [0.0, 1.0], c: [0.0, 1.0]},
  showAtoms = true,
  showBonds = true,
  shift = [0.0, 0.0, 0.0],
  alpha = 1.0,
  ...props
}, ref) => {
  const atomRef = useRef();
  const bondRef = useRef();

  const geometries = useMemo(() => {
    const viewGraph = getViewGraph({ structureGraph: graph, bondCutoffs: bondCutoffs, basis: basis, cellBounds: cellBounds })
    const geometryData = graphGeometries({ graph: viewGraph, shift: shift });
    const mergedGeometries = {
      atoms: (geometryData.atoms.length > 0 ? BufferGeometryUtils.mergeGeometries(geometryData.atoms) : new THREE.BufferGeometry()),
      bonds: (geometryData.bonds.length > 0 ? BufferGeometryUtils.mergeGeometries(geometryData.bonds) : new THREE.BufferGeometry()),
    };

    return mergedGeometries;
  }, [graph, shift, cellBounds, basis, bondCutoffs]);

  const materialProps = {
    vertexColors: true,
    roughness: 0.5,
    metalness: 0.7,
    opacity: alpha,
    transparent: alpha < 1.0,
    depthWrite: true,
    side: THREE.FrontSide,
  };

  return (
    <group ref={ref}>
        <mesh
          key={uuid()}
          ref={atomRef}
          geometry={geometries.atoms}
          material={new THREE.MeshPhysicalMaterial({ visible: showAtoms, ...materialProps })}
        />
        <mesh
          key={uuid()}
          ref={bondRef}
          geometry={geometries.bonds}
          material={new THREE.MeshPhysicalMaterial({ visible: showBonds, ...materialProps })}
        />
    </group>
  );
});
export const StructureGeometryOld = ({ viewGraph }) => {
  const data = useMemo(() => {
    const geoms = [];
    viewGraph.forEachNode((node, attributes) => {
      const neighborInCell = viewGraph.filterNeighbors(
        node,
        (node, attr) => attr.inCell
      );
      if (attributes.inCell | (neighborInCell.length > 0)) {
        if (attributes.motifType === "atom") {
          const atom = getAtom({
            radius: attributes.motif.radius,
            position: attributes.position,
            color: attributes.motif.color,
          });
          geoms.push(atom);
        } else if (attributes.motifType == "molecule") {
          console.log("MOLECULE");
        }
      }
    });

    viewGraph.forEachEdge(
      (
        edge,
        attributes,
        source,
        target,
        sourceAttributes,
        targetAttributes
      ) => {
        if (sourceAttributes.inCell | targetAttributes.inCell) {
          attributes.bonds.forEach((bondProps, index) => {
            const bond = getBond({
              toPosition: bondProps.toPosition,
              fromPosition: bondProps.fromPosition,
              color: bondProps.color,
            });
            geoms.push(bond);
          });
        }
      }
    );

    if (geoms.length > 0) {
      const mergedGeoms = BufferGeometryUtils.mergeGeometries(geoms);
      return mergedGeoms;
    } else {
      return new THREE.BufferGeometry();
    }
  }, [viewGraph]);

  return data;
};

export const getViewGraph = ({
  structureGraph,
  bondCutoffs,
  basis,
  cellBounds,
}) => {
  const newGraph = structureGraph.copy();

  newGraph.forEachNode((node, _) => {
    newGraph.updateNode(node, (attr) => {
      return {
        ...attr,
        inCell: isInCell({
          bounds: cellBounds,
          fracPosition: attr.fracPosition,
        }),
      };
    });
  });

  newGraph.forEachEdge(
    (
      edge,
      edgeAttributes,
      source,
      target,
      sourceAttributes,
      targetAttributes
    ) => {
      if (
        edgeAttributes.bondLength > bondCutoffs[edgeAttributes.atomicNumberKey]
      ) {
        newGraph.dropEdge(edge);
      }
    }
  );

  const getNodeLabel = ({ initLabel, image }) => {
    const splitLabel = initLabel.split(",").map((v, _) => parseInt(v));
    const initImage = splitLabel.slice(1);
    const siteIndex = splitLabel[0];
    const shiftImage = mathjs.add(initImage, image);
    const imageSplitNode = [siteIndex, ...shiftImage];
    const imageNode = imageSplitNode.map((v, _) => v.toString()).join(",");

    return imageNode;
  };

  for (
    let a = Math.floor(cellBounds.a[0]);
    a <= Math.ceil(cellBounds.a[1]);
    a++
  ) {
    for (
      let b = Math.floor(cellBounds.b[0]);
      b <= Math.ceil(cellBounds.b[1]);
      b++
    ) {
      for (
        let c = Math.floor(cellBounds.c[0]);
        c <= Math.ceil(cellBounds.c[1]);
        c++
      ) {
        if (!(a == 0 && b == 0 && c == 0)) {
          const fracShift = [a, b, c];
          const cartShift = getTranslationFromImage({
            basis: basis,
            image: fracShift,
          });
          structureGraph.forEachNode((node, attributes) => {
            const imageNode = getNodeLabel({
              initLabel: node,
              image: fracShift,
            });

            const newNodeAttributes = { ...attributes };

            newNodeAttributes.position = mathjs.add(
              attributes.position,
              cartShift
            );

            newNodeAttributes.fracPosition = mathjs.add(
              attributes.fracPosition,
              fracShift
            );

            newNodeAttributes.inCell = isInCell({
              bounds: cellBounds,
              fracPosition: newNodeAttributes.fracPosition,
            });

            if (!newGraph.hasNode(imageNode)) {
              newGraph.addNode(imageNode, newNodeAttributes);
            }
          });

          structureGraph.forEachEdge(
            (
              edge,
              edgeAttributes,
              source,
              target,
              sourceAttributes,
              targetAttributes
            ) => {
              if (
                !(
                  edgeAttributes.bondLength >
                  bondCutoffs[edgeAttributes.atomicNumberKey]
                )
              ) {
                const imageSourceNode = getNodeLabel({
                  initLabel: source,
                  image: fracShift,
                });
                const imageTargetNode = getNodeLabel({
                  initLabel: target,
                  image: fracShift,
                });

                const newEdgeAttributes = { ...edgeAttributes };

                newEdgeAttributes.bonds = [
                  {
                    toPosition: mathjs.add(
                      edgeAttributes.bonds[0].toPosition,
                      cartShift
                    ),
                    fromPosition: mathjs.add(
                      edgeAttributes.bonds[0].fromPosition,
                      cartShift
                    ),
                    color: edgeAttributes.bonds[0].color,
                  },
                  {
                    toPosition: mathjs.add(
                      edgeAttributes.bonds[0].toPosition,
                      cartShift
                    ),
                    fromPosition: mathjs.add(
                      edgeAttributes.bonds[1].fromPosition,
                      cartShift
                    ),
                    color: edgeAttributes.bonds[1].color,
                  },
                ];

                if (!newGraph.hasEdge(imageSourceNode, imageTargetNode)) {
                  newGraph.addEdge(
                    imageSourceNode,
                    imageTargetNode,
                    newEdgeAttributes
                  );
                }
              }
            }
          );
        }
      }
    }
  }

  return newGraph;
};

export const getTranslationFromImage = ({ basis, image }) => {
  const aVec = mathjs.multiply(basis[0], image[0]);
  const bVec = mathjs.multiply(basis[1], image[1]);
  const cVec = mathjs.multiply(basis[2], image[2]);

  return mathjs.add(aVec, bVec, cVec);
};

export const getCenterShift = ({ basis, bounds }) => {
  const aMid = 0.5 * (bounds.a[0] + bounds.a[1]);
  const bMid = 0.5 * (bounds.b[0] + bounds.b[1]);
  const cMid = 0.5 * (bounds.c[0] + bounds.c[1]);
  const image = [-aMid, -bMid, -cMid];

  return getTranslationFromImage({ basis: basis, image: image });
};

export const isInCell = ({ bounds, fracPosition }) => {
  return (
    bounds.a[0] <= fracPosition[0] &&
    fracPosition[0] <= bounds.a[1] &&
    bounds.b[0] <= fracPosition[1] &&
    fracPosition[1] <= bounds.b[1] &&
    bounds.c[0] <= fracPosition[2] &&
    fracPosition[2] <= bounds.c[1]
  );
};

// export const BoundsRefresher = ({ cellBounds }) => {
//     const api = useBounds();

//     useEffect(() => {
//         api.refresh().fit().clip()
//     }, [cellBounds])

//     // return (
//     // 	<group
//     // 		onClick={(e) => (
//     // 			e.stopPropagation(), e.delta <= 2 && api.refresh(e.object).fit()
//     // 		)}
//     // 		onPointerMissed={(e) => e.button === 0 && api.refresh().fit()}
//     // 	>
//     // 		{props.children}
//     // 	</group>
//     // );
// }
