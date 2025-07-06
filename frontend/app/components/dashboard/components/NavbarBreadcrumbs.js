import * as React from "react";
import { usePathname } from "next/navigation";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

import {
  mainListItems,
  secondaryListItems,
} from "../../../(main)/utils/NavListItems";
import { Link } from "@mui/material";

const navItems = [...mainListItems, ...secondaryListItems];

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center",
  },
}));

function getBreadcrumbs(pathname) {
  // Split and accumulate path segments
  const segments = pathname.split("/").filter(Boolean);
  let path = "";
  const breadcrumbs = segments.map((segment, idx) => {
    path += "/" + segment;
    // Try to find a nav item matching this path
    const navItem = navItems.find((item) => item.path === path);
    return navItem
      ? { text: navItem.text, path: navItem.path }
      : { text: segment.charAt(0).toUpperCase() + segment.slice(1), path };
  });
  // Always start with Dashboard
  return [{ text: "Home", path: "/" }, ...breadcrumbs];
}

export default function NavbarBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {breadcrumbs.map((crumb, idx) =>
        idx < breadcrumbs.length - 1 ? (
          <Link key={crumb.path} href={crumb.path}>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", textDecoration: "none" }}
            >
              {crumb.text}
            </Typography>
          </Link>
        ) : (
          <Typography
            key={crumb.path}
            variant="body1"
            sx={{ color: "text.primary", fontWeight: 600 }}
          >
            {crumb.text}
          </Typography>
        )
      )}
    </StyledBreadcrumbs>
  );
}
