import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Box from "@material-ui/core/Box";
import Slide from "@material-ui/core/Slide";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Zoom, Fab, IconButton, Tooltip } from "@material-ui/core";
import { KeyboardArrowUp, Map, ImageSearchRounded } from "@material-ui/icons/";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  // menuButton: {
  //   // marginRight: theme.spacing(2)
  // },
  title: {
    // flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
    color: "red",
    width: "100px"
  },
  icons_container: {
    display: "flex"
  }
}));

function HideOnScroll(props) {
  const { children } = props;

  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
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

  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Flickr GeoExplorer
            </Typography>
            <div className={classes.grow} />
            <div className={classes.icons_container}>
              <Tooltip title="Search Photos" aria-label="Search Photos">
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="search photos"
                  onClick={props.searchFlikr}
                >
                  <ImageSearchRounded />
                </IconButton>
              </Tooltip>
              <Tooltip title="Toggle Map" aria-label="Toggle Map">
                <IconButton
                  edge="end"
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
      {/* <Container> */}
      <Box
        style={matches ? { margin: "5px 25px 2px" } : { margin: "5px 0 2px" }}
      >
        {props.children}
      </Box>
      {/* </Container> */}
      <ScrollTop {...props}>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUp />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  );
}
