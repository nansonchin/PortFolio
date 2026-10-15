export const JARVIS_OPEN_EVENT="jarvis:open";

export function openJarvis(){
    window.dispatchEvent(new Event(JARVIS_OPEN_EVENT));
}