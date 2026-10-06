import { useState } from "react";

export function useLightbox<T>() {
  const [items, setItems] = useState<T[]>([]);
    const [currentIndex,setCurrentIndex] = useState<number>(0)

  const open = (
    list:T[],
    index:number
  )=>{
    setItems(list)
    setCurrentIndex(index)
  }

  const close =()=>{
    setItems([])
    setCurrentIndex(0)

  }

  const next = ()=>{
    setCurrentIndex((prev)=>{
        if(prev>= items.length-1){
            return 0
        }
        return prev +1
    })
  }

  const previous = ()=>{
    setCurrentIndex((prev)=>{
        if(prev <=0){
            return items.length-1
        }
        return prev-1
    })
  }

  return{
    selectedItem:items[currentIndex]??null,
    currentIndex,
    total:items.length,
    open,close, next,previous
  }
}
