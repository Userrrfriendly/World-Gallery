import React, { useContext } from "react";
import {
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
  Select,
  makeStyles
} from "@material-ui/core";
import QueryContext from "../../context/QueryContext/queryContext";
import DispatchQueryContext from "../../context/QueryContext/dispatchQueryContext";
import { SET_SEARCH_METHOD_SORTING } from "../../context/QueryContext/queryReducer";

const useStyles = makeStyles(theme => ({
  formControl: {
    width: "100%"
  },
  root_select: {
    textAlign: "left"
  }
}));

export default function SelectSortingMethod(props) {
  const classes = useStyles();
  const store = useContext(QueryContext);
  const dispatch = useContext(DispatchQueryContext);

  const handleSelectChange = event => {
    dispatch({
      type: SET_SEARCH_METHOD_SORTING,
      payload: event.target.value
    });
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="sorting-helper">Display results by:</InputLabel>
      <Select
        classes={{ root: classes.root_select }}
        value={store.sortMethod}
        onChange={handleSelectChange}
      >
        <MenuItem value={"date-posted-asc"}>Date posted ascending</MenuItem>
        <MenuItem value={"date-posted-desc"}>Date posted descending</MenuItem>
        <MenuItem value={"date-taken-asc"}>Date taken ascending</MenuItem>
        <MenuItem value={"date-taken-desc"}>Date taken descending</MenuItem>
      </Select>
      <FormHelperText>
        Sorting filters must be set before photo search
      </FormHelperText>
    </FormControl>
  );
}
