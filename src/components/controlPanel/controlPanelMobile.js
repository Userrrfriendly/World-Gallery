import React from "react";
import { Paper, makeStyles, Button, Tooltip } from "@material-ui/core";
import { ImageSearchRounded } from "@material-ui/icons";
import LocationSearch from "./geoCodingBar/geoCodingBar";
import LoadingBar from "../LoadingBar/loadingBar";

const useStyles = makeStyles(theme => ({
  panel: {
    textAlign: "center",
    display: "flex",
    flexFlow: "column"
  },
  wrapper: {
    margin: "0 0.5rem"
  },
  control_icon: {
    marginRight: "1rem"
  },
  search_btn_box: {
    margin: "0.5rem 0",
    width: "100%"
  }
}));

const ControlPanelMobile = props => {
  const classes = useStyles();

  const infoTextBox = `Zoom to the location that you want to search for photos and hit the search button.`;

  return (
    <Paper className={classes.panel}>
      <div className={classes.wrapper}>
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
        {props.loadingPhotos && <LoadingBar />}
      </div>
    </Paper>
  );
};

export default ControlPanelMobile;
