import { Menu, MenuItem } from "react-pro-sidebar";
import { useSelector } from "react-redux";
import { FaUserCircle} from "react-icons/fa";
import '../css/sidebarHeader.css'
import { RowRight } from "../../assets/img/icons/RowRight";
import { RowLeft } from "../../assets/img/icons/RowLeft";

export const Header = ({ collapsed, setCollapsed }) => {

    const { profile } = useSelector((store) => store.auth);

  console.log(profile);
  

  const handleCollapsedChange = () => {
    setCollapsed(!collapsed);
  }; 


  const iconUser = () => {   
        return <FaUserCircle className="profile-image" />    
     
  }


  return (
    <div className="sidebarHeader">


      <Menu iconShape="circle" className="mt-4">
        {collapsed ? (         
            <MenuItem
              className="menu-display"
              icon={<RowRight/>}
              onClick={handleCollapsedChange}
            ></MenuItem>         
        ) : (
          <MenuItem
            className="menu-display mb-3"
            onClick={handleCollapsedChange}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <RowLeft/>
              <span style={{ marginLeft: "15px" }}>Minimizar</span>
            </div>
          </MenuItem>
        )}
        <div className="profile-container">
           {iconUser()}       
           {!collapsed &&
          <div className="profile-info">
            {profile.nombre} <br />
            <span className="badge pointer">
             {profile.role}
            </span>
          </div>
}
        </div>
      </Menu>
      </div>
    
  );
};