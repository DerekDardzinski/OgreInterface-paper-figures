'use client'

import { Cylinder } from '../GeometryHelpers/GeometryHelpers'

export const Bond = ({ fromPosition, toPosition, color }) => {
    return (
        <Cylinder fromPosition={fromPosition} toPosition={toPosition} color={color} />
    )
}

