import { Outlet } from "react-router-dom";
import styles from "./style.module.scss";
import Header from "@components/Header/Header";
import Navbar from "@components/Navbar/Navbar";
export default function Layout() {

    const {container, container_child} = styles
    return (
        <div className={container}>
            <Header />
            <Navbar />
            <div className={container_child}>
                <Outlet />
            </div>
        </div>
    )
}