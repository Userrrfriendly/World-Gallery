import React from "react";
import {
  // TextField,
  InputAdornment,
  InputLabel,
  Input,
  IconButton,
  FormControl,
  FormHelperText
} from "@material-ui/core/";
import { Close } from "@material-ui/icons/";

export default function TextQuery(props) {
  const handleSubmit = e => {
    e.preventDefault();
    console.log("Submit!");
    props.searchFlikr();
  };
  return (
    <>
      {/* <form onSubmit={handleSubmit}>
        <TextField
          label="Optional text query"
          value={props.searchText}
          onChange={props.handleTextQueryChange}
          fullWidth
          // className={classes.textField}
          helperText="Adding text to the query will greatly limit the photos results"
          margin="normal"
          placeholder="text search in photos names,tags,albums"
        />
      </form> */}

      <form onSubmit={handleSubmit}>
        <FormControl onSubmit={handleSubmit} style={{ width: "100%" }}>
          <InputLabel htmlFor="adornment-text">Optional text query</InputLabel>
          <Input
            id="adornment-text"
            type="text"
            fullWidth
            placeholder="search for a keyword/phrase in photo-titles,tags,albums"
            value={props.searchText}
            onChange={props.handleTextQueryChange}
            endAdornment={
              <InputAdornment position="end">
                {/* {props.searchText.length > 0 ? ( */}
                <IconButton
                  style={props.searchText.length > 0 ? {} : { display: "none" }}
                  aria-label="toggle password visibility"
                  onClick={props.clearTextQuery}
                >
                  <Close />
                </IconButton>
                {/* ) : null} */}
              </InputAdornment>
            }
          />
        </FormControl>
        <FormHelperText style={{ margin: "5px 0 " }}>
          Adding text to the query will greatly limit the photos results
        </FormHelperText>
      </form>
    </>
  );
}
