import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Button,
  makeStyles
} from "@material-ui/core/";
import {
  MenuRounded,
  ExpandLess,
  ExpandMore,
  MyLocationTwoTone,
  Map,
  Ballot,
  ChevronLeft
} from "@material-ui/icons/";
import RequstNumberSlider from "../controlPanel/requestsNumberSlider";
import SelectSortingMethod from "../controlPanel/selectSortingMethod";
import TextQuery from "../controlPanel/textQuery";
import MinUploadDatePicker from "../controlPanel/datePickers/minUploadDatePicker";
import MaxUploadDatePicker from "../controlPanel/datePickers/maxUploadDatePicker";
import MinTakenDatePicker from "../controlPanel/datePickers/minTakenDatePicker";
import MaxTakenDatePicker from "../controlPanel/datePickers/maxTakenDatePicker";
import CustomSwitch from "../controlPanel/switches/customSwitch";

const useStyles = makeStyles({
  list: {
    width: "70vw"
  },
  fullList: {
    width: "auto"
  },
  hamburger: {
    marginRight: "0.5rem",
    color: "#fff"
  }
});

export default function DrawerMenu(props) {
  const classes = useStyles();

  const [openQueryOption, setOpenQueryOptions] = useState(false);
  const handleQueryOptionsClick = () => setOpenQueryOptions(!openQueryOption);
  const [openMapOptions, setOpenMapOptions] = useState(false);
  const handleMapOptionsClick = () => setOpenMapOptions(!openMapOptions);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => {
    const prevState = !drawerOpen;
    setDrawerOpen(prevState);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const DrawerItems = () => (
    <div className={classes.list} role="presentation">
      <List style={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton onClick={closeDrawer} style={{ marginRight: "1rem" }}>
          <ChevronLeft />
        </IconButton>
      </List>
      <Divider />

      <List>
        <ListItem button onClick={handleQueryOptionsClick}>
          <ListItemIcon>
            <Ballot />
          </ListItemIcon>
          <ListItemText primary="Query Options" />
          {openQueryOption ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={openQueryOption} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem style={{ flexFlow: "column" }}>
              <RequstNumberSlider />
            </ListItem>

            <ListItem>
              <SelectSortingMethod
                handeSelectSortMethod={props.handeSelectSortMethod}
                sortMethod={props.sortMethod}
              />
            </ListItem>

            <ListItem>
              <TextQuery
                handleTextQueryChange={props.handleTextQueryChange}
                clearTextQuery={props.clearTextQuery}
                searchText={props.searchText}
                searchFlikr={props.searchFlikr}
              />
            </ListItem>

            <Divider className={classes.divider} />

            <ListItem>
              <MinUploadDatePicker />
            </ListItem>

            <ListItem>
              <MaxUploadDatePicker />
            </ListItem>

            <Divider className={classes.divider} />

            <ListItem>
              <MinTakenDatePicker />
            </ListItem>
            <ListItem>
              <MaxTakenDatePicker />
            </ListItem>
          </List>
        </Collapse>
      </List>
      {/* SECOND COLLAPSABLE LIST  */}
      <List>
        <ListItem button onClick={handleMapOptionsClick}>
          <ListItemIcon>
            <Map />
          </ListItemIcon>
          <ListItemText primary="Map Options" />
          {openMapOptions ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={openMapOptions} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem>
              <CustomSwitch
                callback={props.togglePhotoMarkerDisplay}
                checked={props.displayPhotoMarkers}
                label="Hide all results from the map"
              />
            </ListItem>
            <ListItem>
              <CustomSwitch
                callback={props.toggleFavorites}
                checked={props.displayFavorites}
                label="Hide all favorites from the map"
              />
            </ListItem>
            <ListItem>
              <Button
                variant="contained"
                style={{ marginTop: "1rem", color: "black", width: "100%" }}
                color="secondary"
                size={"large"}
                onClick={props.handleMyLocationClick}
              >
                <MyLocationTwoTone style={{ marginRight: "1rem" }} />
                My location
              </Button>
            </ListItem>
          </List>
        </Collapse>
      </List>
    </div>
  );

  return (
    <div>
      <IconButton
        onClick={toggleDrawer}
        aria-label="Open Menu"
        size="medium"
        className={classes.hamburger}
      >
        <MenuRounded fontSize="large" />
      </IconButton>

      <Drawer open={drawerOpen} onClose={closeDrawer}>
        {DrawerItems()}
      </Drawer>
    </div>
  );
}
