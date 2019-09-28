import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  useScrollTrigger,
  Box,
  Slide,
  useMediaQuery,
  Zoom,
  Fab,
  IconButton,
  Tooltip,
  makeStyles
} from "@material-ui/core/";
import {
  KeyboardArrowUp,
  Map,
  ViewStream as Rows,
  ViewWeek as Columns
} from "@material-ui/icons/";
import Logo from "../../assets/logo";

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
  }
}));

function HideOnScroll(props) {
  const trigger = useScrollTrigger();
  return (
    <Slide
      appear={false}
      direction="down"
      /* if appBarHide is true hide the appbar otherwise leave useScrollTrigger to deal with it */
      in={props.appBarHide ? false : !trigger}
    >
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
  const matches = useMediaQuery("(min-width:1200px)");
  const classes = useStyles();

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
      <HideOnScroll appBarHide={props.appBarHide} {...props}>
        <AppBar>
          <Toolbar>
            <div className={classes.logo_container} onClick={scrollToTop}>
              <Logo
                style={{ width: "40px", marginRight: "0.75rem", fill: "white" }}
                aria-label="Flickr"
              />
              <Typography variant="h6">
                <span style={{ color: "#dedee6" }}>Geo</span>
                <span style={{ color: "#ffc1d5" }}>Explorer</span>
              </Typography>
            </div>
            <div className={classes.grow} />
            <div className={classes.icons_container}>
              {/* <Tooltip title="Search Photos" aria-label="Search Photos">
                <IconButton
                  color="inherit"
                  aria-label="search photos"
                  onClick={props.searchFlikr}
                >
                  <ImageSearchRounded />
                </IconButton>
              </Tooltip> */}
              {props.photos > 0 && (
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
              <Tooltip title="Toggle Map" aria-label="Toggle Map">
                <IconButton
                  color="inherit"
                  aria-label="toggle map"
                  onClick={props.toggleMap}
                >
                  <Map />
                </IconButton>
              </Tooltip>
            </div>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar id="back-to-top-anchor" />
      <Box
        style={matches ? { margin: "5px 25px 2px" } : { margin: "5px 0 2px" }}
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
