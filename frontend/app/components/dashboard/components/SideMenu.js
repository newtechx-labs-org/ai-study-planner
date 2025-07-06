import * as React from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MenuContent from "./MenuContent";
import { useRouter } from "next/navigation";
import { mainListItems } from "@/app/(main)/utils/NavListItems";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
});

export default function SideMenu({ user }) {
  const router = useRouter();

  const navItem = mainListItems.find((item) => item.users.includes(user.role));

  const handleRefresh = () => {
    if (navItem) {
      router.push(navItem.path);
    } else {
      router.push("/");
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      <Box
        onClick={handleRefresh}
        sx={{
          display: "flex",
          mt: "calc(var(--template-frame-height, 0px) + 4px)",
          p: 1.5,
        }}
      >
        <Typography variant="h5" component="h1" sx={{ color: "text.primary" }}>
          {process.env.NEXT_PUBLIC_APP_NAME}
        </Typography>
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MenuContent />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Avatar
          sizes="small"
          alt={user.username.toUpperCase()}
          src="#"
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: "auto" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              lineHeight: "16px",
              textTransform: "capitalize",
            }}
          >
            {user.first_name + " " + user.last_name}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {user.email}
          </Typography>
        </Box>
      </Stack>
    </Drawer>
  );
}
