import React from "react";
import {
  makeStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography
} from "@material-ui/core/";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import GeoCodingBar from "./geoCodingBar/geoCodingBar.js";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  details_root: {
    display: "flex",
    flexFlow: "column"
  },
  details_root_geolocation: {
    padding: "4px",
    marginBottom: "12px"
  }
}));

export default function ExpansionPanels(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="geolocation-search"
        >
          <Typography className={classes.heading}>
            Geolocation search
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails
          id="geolocation-search"
          classes={{ root: classes.details_root_geolocation }}
        >
          <GeoCodingBar />
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="request-options-content"
        >
          <Typography className={classes.heading}>Query Options</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails
          id="request-options-content"
          classes={{ root: classes.details_root }}
        >
          {props.requestOptions}
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="map-options-content"
        >
          <Typography className={classes.heading}>Map Options</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails
          id="map-options-content"
          classes={{ root: classes.details_root }}
        >
          {props.mapOptions}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}
