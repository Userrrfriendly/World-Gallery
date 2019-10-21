import React, { useContext } from "react";
import StateContext from "../../context/stateContext";
import { makeStyles, IconButton } from "@material-ui/core";
import {
  Close,
  Fullscreen,
  FullscreenExit,
  Favorite,
  FavoriteBorder
} from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  header_container: {
    position: "absolute",
    top: "2px",
    left: "2px",
    width: "100vw",
    display: "flex",
    zIndex: "2000",
    justifyContent: "space-between", //"flex-end", to align btns to the right
    transition: "opacity 300ms",
    opacity: "1"
  },
  lightbox_btn: {
    color: "#fff",
    background: "rgba(255, 255, 255, 0.2)",
    margin: "2px",
    border: "1px solid #00000024",
    "&:hover": {
      boxShadow: "0px 0px 11px 0px rgba(0,0,0,0.75)",
      background: "rgba(255, 255, 255, 0.3)"
    }
  },
  hide_on_idle: {
    opacity: "0"
  }
}));

const LightBoxHeader = props => {
  /*most props like carouselProps, interactionIsIdle etc are passed by default props react-photo-gallery*/
  const classes = useStyles();
  const store = useContext(StateContext);

  const isFavorite = React.useMemo(
    () =>
      store.favorites.find(el => el.photoId === props.currentView.photoId)
        ? true
        : false,
    [store.favorites, props.currentView.photoId]
  );

  return props.isModal ? (
    <div
      className={
        props.interactionIsIdle
          ? classes.header_container + " " + classes.hide_on_idle
          : classes.header_container
      }
    >
      <IconButton
        aria-label="Pin photo on map"
        className={classes.lightbox_btn}
        onClick={props.carouselProps.imageToggleFavorites.bind(
          this,
          props.data,
          isFavorite
        )}
      >
        {isFavorite ? (
          <Favorite style={{ color: "gold" }} />
        ) : (
          <FavoriteBorder />
        )}
      </IconButton>

      <div className={classes.btn_container_right}>
        <IconButton
          aria-label="toggle fullscreen"
          className={classes.lightbox_btn}
          edge="start"
          onClick={props.modalProps.toggleFullscreen}
        >
          {props.modalProps.isFullscreen ? <FullscreenExit /> : <Fullscreen />}
        </IconButton>

        {!props.modalProps.isFullscreen && (
          <IconButton
            aria-label="Close"
            className={classes.lightbox_btn}
            edge="start"
            onClick={props.modalProps.onClose}
          >
            <Close />
          </IconButton>
        )}
      </div>
    </div>
  ) : null;
};

export default LightBoxHeader;
