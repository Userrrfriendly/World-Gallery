import React from "react";

import { Button, useMediaQuery, makeStyles } from "@material-ui/core";
import { ImageSearchRounded } from "@material-ui/icons";
import SplitButton from "./SplitBtn";

const useStyles = makeStyles(theme => ({
  controls_panel: {
    border: "1px solid #999",
    padding: "5px",
    textAlign: "center",
    lineHeight: "30px",
    backgroundColor: "#fff"
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
    <div className={classes.controls_panel}>
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
    </div>
  );
};

export default AppControls;
