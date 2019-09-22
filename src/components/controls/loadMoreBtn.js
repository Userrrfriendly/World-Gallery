import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  button: {
    margin: "1rem auto",
    display: "block"
  }
}));

const LoadMoreButton = props => {
  const classes = useStyles();
  return (
    <Button
      onClick={props.onClick}
      variant="outlined"
      size="large"
      className={classes.button}
    >
      Load more photos
    </Button>
  );
};

export default LoadMoreButton;
