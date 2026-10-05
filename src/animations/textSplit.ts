type SplitCharacter ={
    char:string,
    index:number
}

export function splitText(text: string):SplitCharacter[] {
  return text.split("").map((char, index) => ({
    char,
    index,
  }));
}
