import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

// Main item list
export const mainListItems = [
  {
    text: "Home",
    icon: <HomeRoundedIcon />,
    path: "/home",
    users: ["admin", "user"],
  },
  {
    text: "Users",
    icon: <PeopleRoundedIcon />,
    path: "/users",
    users: ["admin"],
  },
];
export const secondaryListItems = [
  {
    text: "Settings",
    icon: <SettingsRoundedIcon />,
    path: "/settings",
  },
];
