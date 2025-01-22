"use client";

import React, { useRef } from "react";
import { Sphere as BaseSphere, Cylinder as BaseCylinder } from "@react-three/drei";
import * as THREE from "three";

export const Cylinder = ({
  fromPosition = [0.0, 0.0, 0.0],
  toPosition = [1.0, 0.0, 0.0],
  radius = 0.15,
  color = "red",
  isCone = false,
}) => {
  const ref = useRef();
  const toPositionVec = new THREE.Vector3().fromArray(toPosition);
  const fromPositionVec = new THREE.Vector3().fromArray(fromPosition);
  const cylinderVector = new THREE.Vector3().subVectors(toPositionVec, fromPositionVec);
  const normCylinderVector = new THREE.Vector3()
    .add(cylinderVector)
    .divideScalar(cylinderVector.length());
  const initOrientation = new THREE.Vector3().fromArray([0.0, 1.0, 0.0]);
  const cylinerCenter = new THREE.Vector3()
    .addVectors(toPositionVec, fromPositionVec)
    .multiplyScalar(0.5);
  const quat = new THREE.Quaternion().setFromUnitVectors(
    initOrientation,
    normCylinderVector
  );

  return (
    <mesh ref={ref}>
      <group position={cylinerCenter.toArray()}>
        <group quaternion={quat}>
          <BaseCylinder args={[(isCone ? 0 : radius), radius, cylinderVector.length(), 32, 1]}>
            <meshPhysicalMaterial
              attach="material"
              color={color}
              depthWrite={true}
              flatShading={false}
              roughness={0.6}
              metalness={0.0}
              reflectivity={0.0}
              clearcoat={0.0}
            />
          </BaseCylinder>
        </group>
      </group>
    </mesh>
  );
};

export const Sphere = ({ visable = true, position = [0.0, 0.0, 0.0], radius = 0.15, color = "red" }) => {
    return (
        <BaseSphere visible={visable} position={position} args={[radius, 32, 32]}>
            <meshPhysicalMaterial
              attach="material"
              color={color}
              depthWrite={true}
              flatShading={false}
              roughness={0.5}
              metalness={0.7}
              reflectivity={0.0}
              clearcoat={0.0}
            />
        </BaseSphere>
    )
}

