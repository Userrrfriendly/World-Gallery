import React from "react";
import {
  Paper,
  makeStyles,
  Box,
  Button,
  Divider,
  Tooltip
} from "@material-ui/core";
import {
  ImageSearchRounded,
  CenterFocusStrong,
  ZoomOutMap
} from "@material-ui/icons";
import RadiusSlider from "./RadiusSlider";

const useStyles = makeStyles(theme => ({
  panel: {
    textAlign: "center",
    display: "flex",
    flexFlow: "column"
  },
  panel_item: {
    margin: "8px",
    display: "flex"
  },
  wrapper: {
    margin: "0 0.5rem"
  },
  divider: {
    margin: "1rem 0"
  },
  control_icon: {
    marginRight: "1rem"
  },
  search_photos_box: {
    justifyContent: "center"
  },
  secondary_btn: {
    margin: "0 1rem"
  }
}));

const ControlPanelMobile = props => {
  const classes = useStyles();

  return (
    <Paper className={classes.panel}>
      <div className={classes.wrapper}>
        {/* Radius Slider  */}
        <RadiusSlider setSearchRadius={props.setSearchRadius} />

        <Divider className={classes.divider} />

        <Box className={classes.panel_item + " " + classes.search_photos_box}>
          <Tooltip title="Search Photos" aria-label="Search Photos">
            <Button
              variant="contained"
              style={{ backgroundColor: "#179207" }}
              size="medium"
              onClick={props.searchFlikr}
              className={classes.secondary_btn}
            >
              <ImageSearchRounded />
            </Button>
          </Tooltip>

          <Tooltip
            title="Move Search-Area to the Center of map"
            aria-label="Move Search-Area to the Center of map"
          >
            <Button
              variant="contained"
              color="primary"
              size="medium"
              className={classes.secondary_btn}
              onClick={props.centerSearchAreaOnMap}
              // className={smallScreen ? classes.controls_mobile : classes.controls}
            >
              <CenterFocusStrong />
            </Button>
          </Tooltip>

          <Tooltip
            title="Zoom to Search-Area extents"
            aria-label="Zoom to Search-Area extents"
          >
            <Button
              variant="contained"
              color="primary"
              size="medium"
              className={classes.secondary_btn}
              onClick={props.zoomToSearchArea}
              // className={smallScreen ? classes.controls_mobile : classes.controls}
            >
              <ZoomOutMap />
            </Button>
          </Tooltip>
        </Box>
      </div>
    </Paper>
  );
};

export default ControlPanelMobile;
