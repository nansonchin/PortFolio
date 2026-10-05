import { useRef } from "react"

export function  useGsapAnimation <T extends HTMLElement>(){
    const ref = useRef<T | null>(null)

    return ref
}