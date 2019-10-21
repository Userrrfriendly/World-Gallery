import React, { useContext } from "react";
import {
  InputAdornment,
  InputLabel,
  Input,
  IconButton,
  FormControl,
  FormHelperText
} from "@material-ui/core/";
import { Close } from "@material-ui/icons/";
import QueryContext from "../../context/QueryContext/queryContext";
import DispatchQueryContext from "../../context/QueryContext/dispatchQueryContext";
import { SET_SEARCH_TEXT } from "../../context/QueryContext/queryReducer";

export default function TextQuery(props) {
  const store = useContext(QueryContext);
  const dispatch = useContext(DispatchQueryContext);

  const handleInputChange = event => {
    dispatch({
      type: SET_SEARCH_TEXT,
      payload: event.target.value
    });
  };

  const handleClearInput = e => {
    dispatch({
      type: SET_SEARCH_TEXT,
      payload: ""
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.searchFlikr();
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl onSubmit={handleSubmit} style={{ width: "100%" }}>
        <InputLabel htmlFor="adornment-text">Optional text query</InputLabel>
        <Input
          id="adornment-text"
          type="text"
          fullWidth
          placeholder="search for a keyword in tags,albums,titles etc"
          value={store.searchText}
          onChange={handleInputChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                style={store.searchText.length > 0 ? {} : { display: "none" }}
                aria-label="toggle password visibility"
                onClick={handleClearInput}
              >
                <Close />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <FormHelperText style={{ margin: "5px 0 " }}>
        Adding text to the query will greatly limit the results
      </FormHelperText>
    </form>
  );
}
