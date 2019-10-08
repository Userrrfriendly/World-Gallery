import React, { useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  InputAdornment,
  Divider,
  InputBase,
  IconButton
} from "@material-ui/core/";
import { mapReady } from "../../../helpers/helpers";
import { Close, Search as SearchIcon } from "@material-ui/icons/";

const useStyles = makeStyles(theme => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    border: "1px solid #29272752"
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    height: 28,
    margin: 4
  },
  form: {
    display: "flex",
    width: "100%",
    alignItems: "center"
  }
}));

export default function LocationSearch() {
  const classes = useStyles();

  const autoCompleteInputRef = useRef(null);

  let geocoder;

  mapReady(() => {
    geocoder = new window.google.maps.Geocoder();
  });

  let autocomplete = useRef(null);
  const fillInInput = React.useCallback(() => {
    geocodeAddress(geocoder, window.map);
  }, [geocoder]);

  useEffect(() => {
    console.log("USEFFECT ON MOUNT(***********************************)");
    mapReady(() => {
      autocomplete.current = new window.google.maps.places.Autocomplete(
        autoCompleteInputRef.current
        // document.getElementById("autocomplete")
        // { types: ["geocode"] } // If no type is specified, all types will be returned.
      );
      // Avoid paying for data that you don't need by restricting the set of
      // place fields that are returned to just the address components & the formatted_address.
      autocomplete.current.setFields([
        "address_component",
        "formatted_address"
      ]);

      // When the user selects an address from the drop-down,
      autocomplete.current.addListener("place_changed", fillInInput);
    });
  }, [fillInInput]);

  function geocodeAddress(geocoder, resultsMap) {
    const value = autoCompleteInputRef.current.value;
    geocoder.geocode({ address: value }, function(results, status) {
      if (status === "OK") {
        resultsMap.fitBounds(results[0].geometry.viewport);
        // const marker = new window.google.maps.Marker({
        //   map: resultsMap,
        //   position: results[0].geometry.location
        // });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }

  const handleSubmit = e => {
    e.preventDefault();
    geocodeAddress(geocoder, window.map);
  };

  const clearInput = () => {
    autoCompleteInputRef.current.value = "";
  };

  return (
    <Paper className={classes.root} elevation={2}>
      <form onSubmit={handleSubmit} className={classes.form}>
        {/* InputBase is an uncontrolled component so that   google's autocomplete can change its value */}
        <InputBase
          id="autocomplete"
          inputRef={autoCompleteInputRef}
          className={classes.input}
          placeholder="Search address or location"
          inputProps={{ "aria-label": "search google maps" }}
          defaultValue=""
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search google maps input"
                onClick={clearInput}
              >
                <Close />
              </IconButton>
            </InputAdornment>
          }
        />
        <Divider className={classes.divider} orientation="vertical" />
        <IconButton
          type="submit"
          className={classes.iconButton}
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
      </form>
    </Paper>
  );
}
