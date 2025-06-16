import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { useSelector } from "react-redux";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const mainListItems = [
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
const secondaryListItems = [
  {
    text: "Settings",
    icon: <SettingsRoundedIcon />,
    path: "/settings",
  },
];

export default function MenuContent({ toggleDrawer }) {
  const { user } = useSelector((state) => state.auth);
  const [selected, setSelected] = useState(0);
  const router = useRouter();
  const pathName = usePathname();

  const selectHandler = (index, path) => {
    router.push(path);
    toggleDrawer?.(false)();
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => {
          if (!item.users.includes(user.role)) return null;
          return (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                selected={item.path === pathName}
                onClick={() => selectHandler(index, item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={() => selectHandler(index, item.path)}
              selected={item.path === pathName}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
