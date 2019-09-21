import React, { useContext } from "react";
import StateContext from "../../context/stateContext";

import {
  Button,
  ButtonGroup,
  Paper,
  Grow,
  ClickAwayListener,
  Popper,
  MenuItem,
  MenuList,
  makeStyles,
  useMediaQuery
} from "@material-ui/core";
import {
  ArrowDropDown as ArrowDropDownIcon,
  Crop54,
  LocationSearching,
  LocationDisabled,
  CancelPresentation
} from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  split_btn: {
    margin: "2px",
    display: "inline-block"
  },
  popper: {
    zIndex: "2"
  },
  btn_icons: {
    marginRight: "8px"
  }
}));

const options = ["Bounding Box", "Radius"];

export default function SplitBtn(props) {
  const state = useContext(StateContext);
  const smallScreen = useMediaQuery("(max-width:400px)");

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const classes = useStyles();

  function handleMenuItemClick(event, index) {
    setSelectedIndex(index);
    setOpen(false);
  }

  function handleToggle() {
    setOpen(prevOpen => !prevOpen);
  }

  function handleClose(event) {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  }

  return (
    <>
      <ButtonGroup
        variant="contained"
        color="primary"
        ref={anchorRef}
        aria-label="split button"
        className={classes.split_btn}
        size="small"
      >
        <Button
          variant="contained"
          size={!smallScreen ? "small" : "medium"}
          onClick={
            selectedIndex === 0
              ? props.pinBoundingBoxOnMap
              : props.pinRadiusMarkerOnMap
          }
        >
          {selectedIndex === 0 && state.boundingBox && (
            <>
              <CancelPresentation className={classes.btn_icons} />
              {"Remove BoundingBox"}
            </>
          )}
          {selectedIndex === 0 && !state.boundingBox && (
            <>
              <Crop54 className={classes.btn_icons} />
              {"Add " + options[selectedIndex]}
            </>
          )}

          {selectedIndex === 1 && state.radiusMarker && (
            <>
              <LocationDisabled className={classes.btn_icons} />
              {"Remove Radius"}
            </>
          )}
          {selectedIndex === 1 && !state.radiusMarker && (
            <>
              <LocationSearching className={classes.btn_icons} />
              {"Add " + options[selectedIndex]}
            </>
          )}
        </Button>
        <Button
          color="primary"
          size={!smallScreen ? "small" : "medium"}
          aria-owns={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        className={classes.popper}
        open={open}
        anchorEl={anchorRef.current}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom"
            }}
          >
            <Paper id="menu-list-grow">
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={event => handleMenuItemClick(event, index)}
                    >
                      {"Add " + option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
