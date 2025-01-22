'use client'

import { Box, OrbitControls, Environment, View, PerspectiveCamera, Sphere } from "@react-three/drei";
import { BaseLayout } from "@/components/BaseLayout/BaseLayout";

export default function TestPage(props) {
    return (
        <BaseLayout pageTitle={"Test Figure"}>
            <div className="flex flex-row w-screen bg-blue-100 gap-8 m-8">
                <div className="flex flex-col flex-grow bg-base-100">TEST</div>
                <div className="flex flex-col flex-shrik w-60 bg-base-100"></div>
            </div>
        </BaseLayout>
        //     <div className="grid grid-cols-2 flex flex-grow gap-5 m-5">
        //         <div className="relative bg-green-100">
        //             <View className="absolute top-0 left-0 w-[100%] h-[100%]">
        //                 <ambientLight />
        //                 <Box>
        //                     <meshPhysicalMaterial attach="material" color="hotpink" />
        //                 </Box>
        //                 <Sphere position={[2, 0, 0]}>
        //                     <meshPhysicalMaterial attach="material" color="red" />
        //                 </Sphere>
        //                 <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />
        //                 <OrbitControls makeDefault />
        //                 <Environment preset="sunset" />
        //             </View>
        //         </div>
        //         <div className="grid grid-rows-2 gap-5">
        //             <div className="relative bg-purple-100">
        //                 <View className="absolute top-0 left-0 w-[100%] h-[100%]">
        //                     <ambientLight />
        //                     <Box>
        //                         <meshPhysicalMaterial attach="material" color="blue" />
        //                     </Box>
        //                     <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />
        //                     <OrbitControls makeDefault />
        //                     <Environment preset="sunset" />
        //                 </View>
        //             </div>
        //             <div className="relative bg-yellow-100">
        //                 <View className="absolute top-0 left-0 w-[100%] h-[100%]">
        //                     <ambientLight />
        //                     <Box>
        //                         <meshPhysicalMaterial attach="material" color="green" />
        //                     </Box>
        //                     <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />
        //                     <OrbitControls makeDefault />
        //                     <Environment preset="sunset" />
        //                 </View>
        //             </div>
        //         </div>
        //     </div>
    );
}
