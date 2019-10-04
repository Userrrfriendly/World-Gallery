import React, { useContext } from "react";
import {
  Paper,
  makeStyles,
  Box,
  Typography,
  Button,
  Divider,
  Tooltip
} from "@material-ui/core";
import {
  ImageSearchRounded,
  CenterFocusStrong,
  ZoomOutMap,
  MyLocationTwoTone
} from "@material-ui/icons";
import RadiusSlider from "./RadiusSlider";
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
  secondary_btn: {
    margin: "1rem"
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

  const infoTextBox = `Zoom to the location that you want to search for photos and hit the green button below to make the request.`;
  const infoTextCircle = `Drag the blue circle on the map to select the place where you want
to search for photos, when done press the button below to make the request.`;
  return (
    <Paper className={classes.panel}>
      <div className={classes.wrapper}>
        <Box className={classes.panel_item}>
          <Typography>
            {store.searchMethod === "EXTENTS" && infoTextBox}
            {store.searchMethod === "CIRCLE" && infoTextCircle}
          </Typography>
        </Box>
        <Box className={classes.panel_item + classes.search_photos_box}>
          <Button
            variant="contained"
            style={{ backgroundColor: "#179207" }}
            size={"large"}
            onClick={props.searchFlikr}
            // className={smallScreen ? classes.controls_mobile : classes.controls}
          >
            <ImageSearchRounded className={classes.control_icon} />
            Search Photos
          </Button>
          {props.loadingPhotos && <LoadingBar />}
        </Box>
        <Divider className={classes.divider} />
        {/* Radius Slider  */}
        {/* <RadiusSlider setSearchRadius={props.setSearchRadius} />
        <Box className={classes.panel_item + " " + classes.search_photos_box}>
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
        </Box> */}

        {/* NEW */}
        <OptionsPanel
          requestOptions={
            <>
              <RequstNumberSlider />
              <SelectSortingMethod
                handeSelectSortMethod={props.handeSelectSortMethod}
                sortMethod={props.sortMethod}
              />
              <TextQuery
                handleTextQueryChange={props.handleTextQueryChange}
                clearTextQuery={props.clearTextQuery}
                searchText={props.searchText}
                searchFlikr={props.searchFlikr}
              />
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
              {/* <CustomSwitch label="Pin all results on map" /> */}
              <CustomSwitch
                callback={props.togglePhotoMarkerDisplay}
                label="Hide all results from the map"
              />
              <CustomSwitch
                callback={props.toggleFavorites}
                label="Hide all favorites from the map"
              />
              <Button
                variant="contained"
                style={{ marginTop: "1rem", color: "black" }}
                color="secondary"
                size={"large"}
                onClick={props.getMyLocation}
                // className={smallScreen ? classes.controls_mobile : classes.controls}
              >
                <MyLocationTwoTone style={{ marginRight: "1rem" }} />
                My location
              </Button>
            </div>
          }
        >
          {/* <RequstNumberSlider /> */}
        </OptionsPanel>
        {/* /NEW */}

        {/* <Divider className={classes.divider} />
        <Typography align="center"> Search Options</Typography> */}
        {/* Sorting Filters */}
        {/* <Box
          className={classes.panel_item}
          style={{ textAlign: "left", margin: "0" }}
        >
          <SelectSortingMethod
            handeSelectSortMethod={props.handeSelectSortMethod}
            sortMethod={props.sortMethod}
          />
        </Box> */}

        {/* Search by Text */}
        {/* <TextQuery
          handleTextQueryChange={props.handleTextQueryChange}
          clearTextQuery={props.clearTextQuery}
          searchText={props.searchText}
          searchFlikr={props.searchFlikr}
        /> */}
        {/* TEST */}

        {/* END TEST */}
        <Box className={classes.panel_item}>{props.children}</Box>
      </div>
    </Paper>
  );
};

export default ControlPanel;
