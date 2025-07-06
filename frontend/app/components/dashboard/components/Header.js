import * as React from "react";
import Stack from "@mui/material/Stack";
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import NavbarBreadcrumbs from "./NavbarBreadcrumbs";
import MenuButton from "./MenuButton";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "none", md: "flex" },
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        maxWidth: { sm: "100%", md: "1700px" },
        pt: 1.5,
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs />
      <Stack direction="row" sx={{ gap: 1 }}>
        <MenuButton
          aria-label="Open notifications"
          onClick={() => router.push("/signin")}
        >
          <LogoutRounded />
        </MenuButton>
      </Stack>
    </Stack>
  );
}
