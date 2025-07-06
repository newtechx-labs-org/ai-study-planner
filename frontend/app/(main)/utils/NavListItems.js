import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

// Main item list
export const mainListItems = [
  {
    text: "Home",
    icon: <HomeRoundedIcon />,
    path: "/home",
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
