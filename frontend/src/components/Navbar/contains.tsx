import { BiCalendar } from "react-icons/bi";
import { RiToolsFill } from "react-icons/ri";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { GrUserWorker } from "react-icons/gr";
import { IoMdSettings } from "react-icons/io";
import { MdReportGmailerrorred } from "react-icons/md";
import { MdOutlineDashboard } from "react-icons/md";
export const NavItems = [
    {path: "/", label: "Dashborad", icon: <MdOutlineDashboard />},
    {path: "/booking", label: "Quản lý đặt lịch", icon: <BiCalendar />},
    {path: "/service", label: "Dịch vụ", icon: <RiToolsFill />},
    {path: "/customer", label: "Khách hàng", icon: <MdOutlinePeopleAlt />},
    {path: "/staff", label: "Nhân sự", icon: <GrUserWorker />},
    {path: "/report", label: "Báo cáo", icon: <MdReportGmailerrorred />},
    {path: "/setting", label: "Cài đặt", icon: <IoMdSettings />}, 
]