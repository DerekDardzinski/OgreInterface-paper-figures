import React, { useRef } from "react";
import * as mathjs from "mathjs"
import { v4 as uuid } from "uuid";
import { Cylinder, Sphere } from "../GeometryHelpers/GeometryHelpers";

export const UnitCell = ({
	basis = [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]],
	shift = [0, 0, 0],
	color = "red",
	radius = 0.05
}) => {
	const ref = useRef()
	const edgeProps = [
		{ fromPosition: shift, toPosition: mathjs.add(shift, basis[0]), color: color },
		{ fromPosition: shift, toPosition: mathjs.add(shift, basis[1]), color: color },
		{ fromPosition: shift, toPosition: mathjs.add(shift, basis[2]), color: color },
		{ fromPosition: mathjs.add(shift, basis[0]), toPosition: mathjs.add(shift, basis[0], basis[1]), color: color },
		{ fromPosition: mathjs.add(shift, basis[0]), toPosition: mathjs.add(shift, basis[0], basis[2]), color: color },
		{ fromPosition: mathjs.add(shift, basis[1]), toPosition: mathjs.add(shift, basis[1], basis[2]), color: color },
		{ fromPosition: mathjs.add(shift, basis[1]), toPosition: mathjs.add(shift, basis[1], basis[0]), color: color },
		{ fromPosition: mathjs.add(shift, basis[2]), toPosition: mathjs.add(shift, basis[2], basis[0]), color: color },
		{ fromPosition: mathjs.add(shift, basis[2]), toPosition: mathjs.add(shift, basis[2], basis[1]), color: color },
		{ fromPosition: mathjs.add(shift, basis[0], basis[1]), toPosition: mathjs.add(shift, basis[0], basis[1], basis[2]), color: color },
		{ fromPosition: mathjs.add(shift, basis[0], basis[2]), toPosition: mathjs.add(shift, basis[0], basis[1], basis[2]), color: color },
		{ fromPosition: mathjs.add(shift, basis[1], basis[2]), toPosition: mathjs.add(shift, basis[0], basis[1], basis[2]), color: color },
	]

	const cornerProps = [
		{ position: shift, color: color },
		{ position: mathjs.add(shift, basis[0]), color: color },
		{ position: mathjs.add(shift, basis[1]), color: color },
		{ position: mathjs.add(shift, basis[2]), color: color },
		{ position: mathjs.add(shift, basis[0], basis[1]), color: color },
		{ position: mathjs.add(shift, basis[0], basis[2]), color: color },
		{ position: mathjs.add(shift, basis[1], basis[2]), color: color },
		{ position: mathjs.add(shift, basis[0], basis[1], basis[2]), color: color },

	]

	const edges = edgeProps.map((edgeProps, index) => (
		<Cylinder key={uuid()} {...edgeProps} radius={radius} />
	))
	const corners = cornerProps.map((cornerProps, index) => (
		<Sphere key={uuid()} {...cornerProps} radius={radius} />
	))

	return (
		<group ref={ref} >
			{edges}
			{corners}
		</group>
	);
}


export const UnitCellPoints = ({
	basis = [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]],
	shift = [0, 0, 0],
	paddingRadius = 2.5
}) => {
	const ref = useRef()

	const points = [
		shift,
		mathjs.add(shift, basis[0]),
		mathjs.add(shift, basis[0], basis[1]),
		mathjs.add(shift, basis[1]),
		mathjs.add(shift, basis[2]),
		mathjs.add(shift, basis[0], basis[2]),
		mathjs.add(shift, basis[0], basis[1], basis[2]),
		mathjs.add(shift, basis[1], basis[2])
	]

	const spheres = points.map((point, index) => {
		const sphere = (
			<Sphere key={uuid()} visable={false} position={point} color="green" radius={paddingRadius} />
		);
		return sphere
	});

	return (
		<mesh ref={ref} >
			{spheres}
		</mesh>
	);
}

