import { Outlet } from "react-router-dom";
import TerminalAssistant from "../components/TerminalAssistant/TerminalAssistant";


export default function RootLayout(){

    return (
        <>
            <TerminalAssistant />

            <Outlet />
        </>
    )

}