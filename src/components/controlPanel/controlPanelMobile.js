import React, { useContext } from "react";
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
import StateContext from "../../context/stateContext";
import LocationSearch from "./geoCodingBar/geoCodingBar";

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
  },
  search_btn_box: {
    margin: "0.5rem 0",
    width: "100%"
  }
}));

const ControlPanelMobile = props => {
  const classes = useStyles();
  const store = useContext(StateContext);

  const infoTextBox = `Zoom to the location that you want to search for photos and hit the search button.`;
  // infoTextCircle is waiting for search by radius implementation
  //   const infoTextCircle = `Drag the blue circle on the map to select the place where you want
  // to search for photos, when done press the button below to make the request.`;

  return (
    <Paper className={classes.panel}>
      <div className={classes.wrapper}>
        {store.searchMethod === "EXTENTS" ? (
          <>
            <div style={{ marginTop: "5px" }}>{infoTextBox}</div>
            <LocationSearch />
            <Tooltip title="Search Photos" aria-label="Search Photos">
              <Button
                variant="contained"
                style={{ backgroundColor: "#179207" }}
                size="large"
                onClick={props.searchFlikr}
                className={classes.search_btn_box}
              >
                <ImageSearchRounded className={classes.control_icon} />
                Search Photos
              </Button>
            </Tooltip>
          </>
        ) : (
          <>
            <RadiusSlider setSearchRadius={props.setSearchRadius} />

            <Divider className={classes.divider} />

            <Box
              className={classes.panel_item + " " + classes.search_photos_box}
            >
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
                >
                  <ZoomOutMap />
                </Button>
              </Tooltip>
            </Box>
          </>
        )}
      </div>
    </Paper>
  );
};

export default ControlPanelMobile;
