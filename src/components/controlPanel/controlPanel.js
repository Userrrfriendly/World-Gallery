import React, { useContext, memo } from "react";
import {
  Paper,
  makeStyles,
  Box,
  Typography,
  Button,
  Divider
} from "@material-ui/core";
import { ImageSearchRounded, MyLocationTwoTone } from "@material-ui/icons";
import SelectSortingMethod from "./selectSortingMethod";
import TextQuery from "./textQuery";
import CustomSwitch from "./switches/customSwitch";
import RequstNumberSlider from "./requestsNumberSlider";
import OptionsPanel from "./expansionPanels";
import MinUploadDatePicker from "./datePickers/minUploadDatePicker";
import MaxUploadDatePicker from "./datePickers/maxUploadDatePicker";
import MaxTakenDatePicker from "./datePickers/maxTakenDatePicker";
import MinTakenDatePicker from "./datePickers/minTakenDatePicker";
import StateContext from "../../context/stateContext";
import LoadingBar from "../LoadingBar/loadingBar";

const useStyles = makeStyles(theme => ({
  panel: {
    textAlign: "center",
    maxWidth: "40vw",
    width: "40vw",
    display: "flex",
    flexFlow: "column",
    overflowY: "scroll"
  },
  panel_item: {
    margin: "8px",
    display: "flex"
  },
  wrapper: {
    margin: "0.5rem"
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
  map_options_container: {
    display: "flex",
    flexFlow: "column",
    textAlign: "left"
  }
}));

const ControlPanel = props => {
  const store = useContext(StateContext);

  const classes = useStyles();

  const infoTextBox = `Zoom to the location that you want to search for photos and hit the search button.`;

  return (
    <Paper className={classes.panel}>
      <div className={classes.wrapper}>
        <Box className={classes.panel_item}>
          <Typography>{infoTextBox}</Typography>
        </Box>
        <Box className={classes.panel_item + classes.search_photos_box}>
          <Button
            disabled={!store.mapLoaded}
            variant="contained"
            style={{ backgroundColor: "#179207", width: "100%" }}
            size={"large"}
            onClick={props.searchFlikr}
          >
            <ImageSearchRounded className={classes.control_icon} />
            Search Photos
          </Button>
          {props.loadingPhotos && <LoadingBar />}
        </Box>

        <Divider className={classes.divider} />

        <OptionsPanel
          requestOptions={
            <>
              <RequstNumberSlider />
              <SelectSortingMethod />
              <TextQuery searchFlikr={props.searchFlikr} />
              <Divider className={classes.divider} />
              <MinUploadDatePicker />
              <MaxUploadDatePicker />
              <Divider className={classes.divider} />
              <MinTakenDatePicker />
              <MaxTakenDatePicker />
            </>
          }
          mapOptions={
            <div className={classes.map_options_container}>
              <CustomSwitch
                callback={props.togglePhotoMarkerDisplay}
                checked={props.displayPhotoMarkers}
                label="Hide all results from map"
              />
              <CustomSwitch
                callback={props.toggleFavorites}
                checked={props.displayFavorites}
                label="Hide all favorites from map"
              />
              <Button
                variant="contained"
                style={{ marginTop: "1rem", color: "black" }}
                color="secondary"
                size={"large"}
                onClick={props.handleMyLocationClick}
                disabled={!store.mapLoaded}
              >
                <MyLocationTwoTone style={{ marginRight: "1rem" }} />
                My location
              </Button>
            </div>
          }
        ></OptionsPanel>

        <Box className={classes.panel_item}>{props.children}</Box>
      </div>
    </Paper>
  );
};

export default memo(ControlPanel);
