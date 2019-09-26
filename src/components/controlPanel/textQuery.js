import React from "react";
import { TextField } from "@material-ui/core/";

export default function TextQuery(props) {
  const handleSubmit = e => {
    e.preventDefault();
    console.log("Submit!");
    props.searchFlikr();
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
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
      </form>
      {/* //If you deciede to style helperText uncomment this 
      <FormHelperText style={{ color: "red", margin: "0 0 5px 0" }}>
        Adding text to the query will limit the photos results{" "}
      </FormHelperText> */}
    </>
  );
}
