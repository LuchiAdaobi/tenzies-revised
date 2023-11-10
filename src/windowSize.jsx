import { useEffect, useState } from "react";    

export default function WindowSize(width, height) {
    const[width, setWidth] = useState(0)
    const[height, setHeight] = useState(0)

    useEffect(()=> {
        function handleWindowSize(){
            setWidth(window.innerWidth)
            setHeight(window.innerHeight)
        }

        window.addEventListener('resize', handleWindowSize)

        return () => window.removeEventListener('resize', handleWindowSize)
    }, [])

}