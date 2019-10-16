import React, { useContext } from "react";
import { Menu, MenuItem, Link } from "@material-ui/core/";
import DispatchContext from "../../context/dispatchContext";
import { BLOCK_USER } from "../../context/rootReducer";

const linkStyle = {
  width: "100%"
};

export default function ImageMenu(props) {
  const dispatch = useContext(DispatchContext);

  const handleHideUser = () => {
    props.handleMenuClose();
    dispatch({
      type: BLOCK_USER,
      userId: props.photoData.owner
    });
  };

  return (
    <div>
      <Menu
        id="image-menu"
        anchorEl={props.anchorEl}
        keepMounted
        open={Boolean(props.anchorEl)}
        onClose={props.handleMenuClose}
      >
        {!props.openFavorites && (
          <MenuItem onClick={handleHideUser}>
            Temporary hide photos from this user
          </MenuItem>
        )}
        <MenuItem onClick={props.handleMenuClose}>
          <Link
            style={linkStyle}
            target="_blank"
            href={
              props.photoData
                ? `https://www.flickr.com/photos/${props.photoData.owner}/${props.photoData.photoId}`
                : ""
            }
            color="inherit"
          >
            Open Photo in Flickr
          </Link>
        </MenuItem>
      </Menu>
    </div>
  );
}
