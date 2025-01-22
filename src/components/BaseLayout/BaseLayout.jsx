'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { View } from '@react-three/drei'
import { useRef, useState } from 'react'
import { NavBar } from '../NavBar/NavBar'
import { inv } from 'mathjs'

const ScreenShot = ({ takeScreenShot, myCanvas }) => {
    const setDpr = useThree((state) => state.setDpr)
    const { invalidate } = useThree()
    // if (takeScreenShot.current.takeScreenShot) {
    //     invalidate();
    // }
    useFrame(({ gl }) => {
        console.log(takeScreenShot.current.takeScreenShot, takeScreenShot.current.setDpr);
        if (takeScreenShot.current.takeScreenShot && !(takeScreenShot.current.setDpr)) {
            setDpr(4)
            takeScreenShot.current.setDpr = true
            // invalidate();
            // setTakeScreenShot({takeScreenShot: true, setDpr: true})
            gl.clear(true, true, true);
        }
        else if (takeScreenShot.current.takeScreenShot && takeScreenShot.current.setDpr) {
            const screenshot = gl.domElement.toDataURL()
            const createE1 = document.createElement('a')
            createE1.href = screenshot
            createE1.download = 'screenshot'
            createE1.click()
            createE1.remove()
            setDpr(1)
            takeScreenShot.current = {takeScreenShot: false, setDpr: false}
            // invalidate();
            gl.clear(true, true, true);
        }
        else {
            gl.clear(true, true, true);
        }
    })
}

export const BaseLayout = ({ pageTitle, ...props }) => {
    const canvasRef = useRef();
    const myCanvas = useRef();
    const takeScreenShot = useRef({ takeScreenShot: false, setDpr: false });

    return (
        <div
            ref={canvasRef}
            className="w-screen h-screen bg-base-100"
        >
            <div className="flex flex-col h-screen">
                <div className="flex flex-row flex-shrink m-3">
                    <NavBar pageTitle={pageTitle} takeScreenShot={takeScreenShot} />
                </div>
                <div className="flex flex-row flex-grow bg-base-100">
                    {props.children}
                    {/* 
                    <div className="flex flex-row w-screen bg-blue-100 gap-8 m-8">
                        <div className="flex flex-col flex-grow bg-base-100">TEST</div>
                        <div className="flex flex-col flex-shrik w-60 bg-base-100"></div>
                    </div> 
                    */}
                </div>
            </div>
            <Canvas
                eventSource={canvasRef}
                ref={myCanvas}
                gl={{ preserveDrawingBuffer: true, localClippingEnabled: true, antialias: true }}
                dpr={1}
                shadows
                // frameloop="demand"
                className="!absolute top-0 left-0 w-screen h-screen pointer-events-none"
            >
                <ScreenShot takeScreenShot={takeScreenShot} myCanvas={myCanvas} />
                <View.Port />
            </Canvas>
        </div>
    );
}
