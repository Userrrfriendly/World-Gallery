import React, { useState } from "react";
import { Fab, makeStyles, Zoom } from "@material-ui/core";
import { MyLocationRounded, MoreVert } from "@material-ui/icons";
import { getPhotoGeoLocation } from "../../requests/flikr";

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
  // container: {
  //   // position: "relative",
  //   // width: "100%"
  //   position: "absolute",
  //   left: "left",
  //   top: "top"
  // }
}));

const ImageWrapper = ({
  index,
  photo,
  margin,
  direction,
  top,
  left,
  selected,
  pinPhotoOnMap,
  openLightbox,
  handleOpenMenuClick
}) => {
  const classes = useStyles();

  const [hover, setHover] = useState(false);

  const cont = {
    backgroundColor: "#eee",
    cursor: "pointer",
    overflow: "hidden",
    position: "relative"
  };

  const handlePinOnMapClick = id => {
    getPhotoGeoLocation(id).then(res => {
      const result = {
        position: res,
        thumbnail: photo.thumb,
        title: photo.title,
        id: photo.photoId,
        owner: photo.owner,
        thumbWidth: photo.width_t
      };
      return pinPhotoOnMap(result);
    });
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

  //CONTAINER OVERRIDES FOR COLUMNT LAYOUT
  // position: "absolute",
  // left: left,
  // top: top

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
        // position: "absolute",
        // left: left,
        // top: top
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
          aria-label="add"
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
          aria-label="add"
          className={classes.pin_to_map_btn}
          onClick={handlePinOnMapClick.bind(this, photo.photoId)}
        >
          <MyLocationRounded />
        </Fab>
      </Zoom>
    </div>
  );
};

export default React.memo(ImageWrapper);
