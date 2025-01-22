import { Cylinder } from "../GeometryHelpers/GeometryHelpers";
import * as mathjs from "mathjs";

export const LatticeVector = ({
    uvw = [1, 0, 0],
    basis = [
        [1.0, 0.0, 0.0],
        [0.0, 1.0, 0.0],
        [0.0, 0.0, 1.0],
    ],
    color = "red",
    radius = 0.25,
    scale = 1.0,
}) => {
    const latticeVector = mathjs.add(
        mathjs.multiply(basis[0], uvw[0]),
        mathjs.multiply(basis[1], uvw[1]),
        mathjs.multiply(basis[2], uvw[2])
    );

    const vectorCylinderEnd = mathjs.multiply(latticeVector, scale * 0.7);
    const vectorConeEnd = mathjs.multiply(latticeVector, scale);

    return (
        <group>
            <Cylinder
                toPosition={vectorCylinderEnd}
                radius={radius}
                color={color}
            />
            <Cylinder
                fromPosition={vectorCylinderEnd}
                toPosition={vectorConeEnd}
                radius={1.75 * radius}
                color={color}
                isCone={true}
            />
        </group>
    );
};
