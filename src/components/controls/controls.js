import React from "react";

import { Button, useMediaQuery, makeStyles, Paper } from "@material-ui/core";
import {
  ImageSearchRounded,
  ViewStream as Rows,
  ViewWeek as Columns
} from "@material-ui/icons";
import SplitButton from "./SplitBtn";
import LoadingBar from "../LoadingBar/loadingBar";

const useStyles = makeStyles(theme => ({
  controls_panel: {
    textAlign: "center"
    // display: "flex",
    // alignItems: "center",
    // justifyContent: "center"
  },
  controls: {
    color: "#fff",
    margin: "5px"
  },
  controls_mobile: {
    margin: "0.25rem"
  },
  control_icon: {
    marginRight: "8px"
  }
}));

const AppControls = props => {
  const smallScreen = useMediaQuery("(max-width:400px)");
  const classes = useStyles();

  return (
    <>
      <Paper className={classes.controls_panel}>
        <SplitButton
          pinBoundingBoxOnMap={props.pinBoundingBoxOnMap}
          pinRadiusMarkerOnMap={props.pinRadiusMarkerOnMap}
        ></SplitButton>

        <Button
          variant="contained"
          color="primary"
          size={!smallScreen ? "small" : "medium"}
          onClick={props.searchFlikr}
          className={smallScreen ? classes.controls_mobile : classes.controls}
        >
          <ImageSearchRounded className={classes.control_icon} />
          Search Photos
        </Button>

        <Button
          variant="contained"
          color="primary"
          size={!smallScreen ? "small" : "medium"}
          onClick={props.toggleGridDirection}
          className={smallScreen ? classes.controls_mobile : classes.controls}
        >
          {props.gridDirection === "column" ? (
            <>
              <Rows className={classes.control_icon} />
              Switch layout to Rows
            </>
          ) : (
            <>
              <Columns className={classes.control_icon} />
              Switch layout to Columns
            </>
          )}
        </Button>
      </Paper>
      {props.loadingPhotos && <LoadingBar />}
    </>
  );
};

export default AppControls;
