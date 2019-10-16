import React, { useState, useContext } from "react";
import { Fab, makeStyles, Zoom } from "@material-ui/core";
import { Favorite, FavoriteBorder, MoreVert } from "@material-ui/icons";
import { find as _find } from "lodash";
import StateContext from "../../context/stateContext";

const useStyles = makeStyles(theme => ({
  pin_to_map_btn: {
    position: "absolute",
    bottom: "2px",
    left: "2px",
    backgroundColor: "#f500577a",
    "&:hover": {
      boxShadow: "0px 0px 11px 0px rgba(0,0,0,0.75)"
    }
  },
  options_btn: {
    top: "2px",
    right: "2px",
    position: "absolute",
    backgroundColor: "#ffffffa6",
    "&:hover": {
      backgroundColor: "#f5f5f5e8",
      boxShadow: "0px 0px 11px 0px rgba(0,0,0,0.75)"
    }
  },
  image: {
    margin: "2px",
    display: "block"
  }
}));

const ImageWrapper = ({
  index,
  photo,
  margin,
  direction,
  top,
  left,
  selected,
  imageToggleFavorites,
  openLightbox,
  handleOpenMenuClick
}) => {
  const classes = useStyles();
  const state = useContext(StateContext);
  const [hover, setHover] = useState(false);
  const isFavorite = _find(state.favorites, el => el.photoId === photo.photoId)
    ? true
    : false;

  const cont = {
    backgroundColor: "#eee",
    cursor: "pointer",
    overflow: "hidden",
    position: "relative"
  };

  const handleOnMouseEnter = (photo, e) => {
    setHover(true);
  };
  const handleOnMouseLeave = (photo, e) => {
    setHover(false);
  };

  const handleTouch = () => {
    setHover(true);
    window.setTimeout(() => {
      setHover(false);
    }, 3000);
  };

  console.log(direction);
  if (direction === "column") {
    cont.position = "absolute";
    cont.left = left;
    cont.top = top;
  }

  return (
    <div
      style={{
        margin,
        height: photo.height,
        width: photo.width,
        ...cont
      }}
      className={classes.container}
      onMouseEnter={handleOnMouseEnter.bind(this, photo)}
      onMouseLeave={handleOnMouseLeave}
      onTouchStart={handleTouch}
    >
      <img
        src={photo.src}
        title={
          photo.title
            ? photo.title + ` - by user ${photo.ownername}`
            : `untitled - by user ${photo.ownername}`
        }
        alt={photo.alt}
        srcSet={photo.srcSet}
        width={photo.width}
        heigth={photo.height}
        sizes={photo.sizes}
        className={classes.image}
        onClick={event => openLightbox.call(this, event, { index, photo })}
      />
      <Zoom in={hover}>
        <Fab
          size="small"
          aria-label="more"
          className={classes.options_btn}
          onClick={handleOpenMenuClick.bind(this, photo)}
        >
          <MoreVert />
        </Fab>
      </Zoom>

      <Zoom in={hover}>
        <Fab
          size="small"
          color="secondary"
          aria-label={isFavorite ? "remove from favorites" : "add to favorites"}
          className={classes.pin_to_map_btn}
          onClick={imageToggleFavorites.bind(this, photo, isFavorite)}
        >
          {isFavorite ? (
            <Favorite style={{ color: "gold" }} />
          ) : (
            <FavoriteBorder style={{ color: "#000" }} />
          )}
        </Fab>
      </Zoom>
    </div>
  );
};

export default React.memo(ImageWrapper);
