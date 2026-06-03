import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import AccessAlarmRoundedIcon from "@mui/icons-material/AccessAlarmRounded";

// Main item list
export const mainListItems = [
  {
    text: "Home",
    icon: <HomeRoundedIcon />,
    path: "/home",
    users: ["admin", "user"],
  },
  {
    text: "Subjects",
    icon: <MenuBookRoundedIcon />,
    path: "/subjects",
    users: ["admin", "user"],
  },
  {
    text: "Study Plan",
    icon: <AutoGraphRoundedIcon />,
    path: "/study-plan",
    users: ["admin", "user"],
  },
  {
    text: "Progress",
    icon: <InsightsRoundedIcon />,
    path: "/progress",
    users: ["admin", "user"],
  },
];
export const secondaryListItems = [
  {
    text: "Study Availability",
    icon: <ScheduleRoundedIcon />,
    path: "/availability",
  },
  {
    text: "Reminders",
    icon: <AccessAlarmRoundedIcon />,
    path: "/settings/reminder",
  },
  {
    text: "Settings",
    icon: <SettingsRoundedIcon />,
    path: "/settings",
  },
];
