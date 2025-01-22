import React, { useRef } from "react";
import { Line, Sphere } from "@react-three/drei";
import * as mathjs from "mathjs"
import { v4 as uuid } from "uuid";

export const UnitCell = ({
	basis = [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]],
	shift = [0, 0, 0]
}) => {
    const ref = useRef()

	const points = [
		shift,  
		mathjs.add(shift, basis[0]),  
		mathjs.add(shift, basis[0], basis[1]),  
		mathjs.add(shift, basis[1]),  
		shift,   
		mathjs.add(shift, basis[2]),  
		mathjs.add(shift, basis[0], basis[2]),  
		mathjs.add(shift, basis[0]),  
		mathjs.add(shift, basis[0], basis[2]),  
		mathjs.add(shift, basis[0], basis[1], basis[2]),  
		mathjs.add(shift, basis[0], basis[1]),  
		mathjs.add(shift, basis[0], basis[1], basis[2]),  
		mathjs.add(shift, basis[1], basis[2]),  
		mathjs.add(shift, basis[1]),  
		mathjs.add(shift, basis[1], basis[2]),  
		mathjs.add(shift, basis[2]),  

	]
	return (
		<mesh ref={ref} >
			<Line points={points} color={"black"} lineWidth={3} />
		</mesh>
	);
}


export const UnitCellPoints = ({
	basis = [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]],
	shift = [0, 0, 0],
	paddingRadius = 3.0
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

	const spheres = []
	points.map((point, index) => (
		spheres.push(<Sphere visible={false} key={uuid()} position={point} args={[paddingRadius, 10, 10]} />)
	));
	return (
		<mesh ref={ref} >
			{spheres}
		</mesh>
	);
}

