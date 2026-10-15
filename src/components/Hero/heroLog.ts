export function heroLog(tag:string, data?:unknown){
    if(!import.meta.env.DEV) return;

    if(data === undefined){
        console.log(`%c[hero] ${tag}`,"color:#D8BD083")
    }else{
        console.log(`%c[hero] ${tag}`,"color:#D8BD83",data)
    }
}