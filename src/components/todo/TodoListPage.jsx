import { useState } from "react";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import TodoList from "./TodoList";

function TodoListPage(){

const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    
      const toggleSidebar = () => {
        setSidebarCollapsed(!isSidebarCollapsed);
      };
    return <>
    <Header/>
    <div className={`home-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          toggleSidebar={toggleSidebar} 
        />
    

     <div className="main-course-area">
             
        <TodoList/>
         </div>
    </div> 

    </>
}
export default TodoListPage;