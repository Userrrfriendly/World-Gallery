import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  useScrollTrigger,
  Box,
  Slide,
  Zoom,
  Fab,
  IconButton,
  Tooltip,
  makeStyles,
  useMediaQuery
} from "@material-ui/core/";
import {
  KeyboardArrowUp,
  ViewStream as Rows,
  ViewWeek as Columns,
  Favorite
} from "@material-ui/icons/";
import DrawerMenu from "../drawer/drawer";
import { useMinScreenWidth } from "../../helpers/CustomHooks/useMinScreenWidth";
import PngLogo from "../../assets/pngLogo.png";

const useStyles = makeStyles(theme => ({
  root: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  grow: {
    flexGrow: 1,
    color: "red",
    width: "100px"
  },
  icons_container: {
    display: "flex"
  },
  logo_container: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center"
  },
  favorites: {
    color: "#ff0000"
  }
}));

function HideOnScroll(props) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {props.children}
    </Slide>
  );
}

function ScrollTop(props) {
  const { children } = props;
  const classes = useStyles();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100
  });

  const handleClick = event => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.root}>
        {children}
      </div>
    </Zoom>
  );
}

export default function HideAppBar(props) {
  const classes = useStyles();
  const smSceen = useMediaQuery("(max-width:450px)");
  const scrollToTop = event => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar>
          <Toolbar disableGutters={useMinScreenWidth(900) ? false : true}>
            {!useMinScreenWidth(900) && (
              <DrawerMenu
                searchFlikr={props.searchFlikr}
                handleMyLocationClick={props.handleMyLocationClick}
                togglePhotoMarkerDisplay={props.togglePhotoMarkerDisplay}
                toggleFavorites={props.toggleFavorites}
                displayPhotoMarkers={props.displayPhotoMarkers}
                displayFavorites={props.displayFavorites}
              />
            )}

            <div className={classes.logo_container} onClick={scrollToTop}>
              <img
                src={PngLogo}
                aria-label="World Gallery Logo"
                alt="World Gallery Logo"
                style={{ marginRight: "0.5rem", height: "45px" }}
              />
              <Typography variant="h6">
                <span style={{ color: "#dedee6" }}>World</span>
                <span style={{ color: "#ffc1d5" }}>Gallery</span>
              </Typography>
            </div>
            <div className={classes.grow} />
            <div className={classes.icons_container}>
              {props.photos > 0 && !smSceen && (
                <Tooltip
                  title={
                    props.gridDirection === "column"
                      ? "Display images as Rows"
                      : "Display images as Columns"
                  }
                  aria-label={
                    props.gridDirection === "column"
                      ? "Display images as Rows"
                      : "Display images as Columns"
                  }
                >
                  <IconButton
                    color="inherit"
                    onClick={props.toggleGridDirection}
                  >
                    {props.gridDirection === "column" ? (
                      <>
                        <Rows className={classes.control_icon} />
                      </>
                    ) : (
                      <>
                        <Columns className={classes.control_icon} />
                      </>
                    )}
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title="Open Favorites" aria-label="Open Favorites">
                <IconButton
                  color="inherit"
                  aria-label="Open Favorites"
                  onClick={props.handleOpenFavorites}
                >
                  <Favorite className={classes.favorites} />
                </IconButton>
              </Tooltip>
            </div>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar id="back-to-top-anchor" />
      <Box
        style={
          useMinScreenWidth(1200)
            ? { margin: "5px 25px 2px" }
            : { margin: "5px 0 2px" }
        }
      >
        {props.children}
      </Box>
      <ScrollTop {...props}>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUp />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  );
}
