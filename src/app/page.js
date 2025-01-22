'use client'

import { useRef, useState } from "react";
import { BaseLayout } from "@/components/BaseLayout/BaseLayout";

export default function Home() {
  const canvasRef = useRef();
  const myCanvas = useRef();
  const [takeScreenShot, setTakeScreenShot] = useState(false)
  return (
    <BaseLayout pageTitle={"Ogre Interface Figures"}>
    </BaseLayout>
  );
}
