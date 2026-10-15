export function introLog(tag:string,data?:unknown){
    if(!import.meta.env.DEV) return;

    if(data === undefined){
        console.log(`%c[intro] ${tag}`,"color:#D8BD83")
    }else{
        console.log(`%c[intro] ${tag}`,"color:#D8BD83",data)
    }
}