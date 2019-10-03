import React from "react";
import {
  makeStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography
} from "@material-ui/core/";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
  }
}));

export default function ExpansionPanels(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="request-options-content"
        >
          <Typography className={classes.heading}>Request Options</Typography>
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
