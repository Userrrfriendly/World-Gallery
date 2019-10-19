import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tooltip,
  useMediaQuery
} from "@material-ui/core/";
import {
  ViewStream as Rows,
  ViewWeek as Columns,
  Close as CloseIcon
} from "@material-ui/icons/";
import Slide from "@material-ui/core/Slide";

import StateContext from "../../context/stateContext";
import ImageGrid from "../imageGrid/imageGrid";

const useStyles = makeStyles(theme => ({
  appBar: {
    position: "relative"
  },
  title: {
    flex: 1
  },
  direction_btn: {
    margin: "0 1rem"
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FavoritesDialog(props) {
  const classes = useStyles();
  const store = useContext(StateContext);
  const smSceen = useMediaQuery("(max-width:450px)");

  const [gridDirection, setGridDirection] = useState("row");
  const toggleGridDirection = () => {
    setGridDirection(gridDirection === "row" ? "column" : "row");
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={props.openFavorites}
        onClose={props.handleCloseFavorites}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h5" component="h1" className={classes.title}>
              Favorites
            </Typography>
            {store.favorites.length > 0 && !smSceen && (
              <Tooltip
                title={
                  gridDirection === "column"
                    ? "Display images as Rows"
                    : "Display images as Columns"
                }
                aria-label={
                  gridDirection === "column"
                    ? "Display images as Rows"
                    : "Display images as Columns"
                }
              >
                <IconButton
                  className={classes.direction_btn}
                  color="inherit"
                  onClick={toggleGridDirection}
                >
                  {gridDirection === "column" ? (
                    <>
                      <Rows className={classes.control_icon} />
                    </>
                  ) : (
                    <>
                      <Columns className={classes.control_icon} />
                    </>
                  )}
                </IconButton>
              </Tooltip>
            )}
            <IconButton
              edge="start"
              color="inherit"
              onClick={props.handleCloseFavorites}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {store.favorites && (
          <ImageGrid
            photos={store.favorites}
            hiddenPhotos={store.hiddenPhotos}
            responseDetails={props.responseDetails}
            direction={smSceen ? "column" : gridDirection}
            imageToggleFavorites={props.imageToggleFavorites}
            openLightbox={props.openLightbox}
            openFavorites={props.openFavorites}
          />
        )}
      </Dialog>
    </div>
  );
}
