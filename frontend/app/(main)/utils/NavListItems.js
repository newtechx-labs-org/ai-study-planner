import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CategoryIcon from '@mui/icons-material/Category';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import PersonIcon from '@mui/icons-material/Person';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

// Main item list
export const mainListItems = [
  {
    text: "Home",
    icon: <HomeRoundedIcon />,
    path: "/home",
    users: ["admin", "user"],
  },
  {
    text: "Transactions",
    icon: <ListAltIcon />,
    path: "/transactions",
    users: ["admin", "user"],
  },
  {
    text: "Categories",
    icon: <CategoryIcon />,
    path: "/category",
    users: ["admin", "user"],
  },
  {
    text: "Exports",
    icon: <UploadIcon />,
    path: "/exports",
    users: ["admin", "user"],
  },
  
  
  {
    text: "profile",
    icon: <PersonIcon />,
    path: "/profile",
    users: ["admin", "user"],
  },
  
];

export const secondaryListItems = [
  {
    text: "Settings",
    icon: <SettingsRoundedIcon />,
    path: "/settings",
  },
];
