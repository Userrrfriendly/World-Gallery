import "date-fns";
import React, { useState, useContext } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { format } from "date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import Checkbox from "@material-ui/core/Checkbox";
import QueryContext from "../../../context/QueryContext/queryContext";
import DispatchQueryContext from "../../../context/QueryContext/dispatchQueryContext";
import { SET_MIN_TAKEN_DATE } from "../../../context/QueryContext/queryReducer";

export default function MinTakenDatePicker(props) {
  const dispatch = useContext(DispatchQueryContext);
  const store = useContext(QueryContext);

  const [placeholderDate, setPlaceholderDate] = useState(new Date(2004, 1, 1));

  const checked = store.minTakenDate ? true : false;
  let selectedDate = checked ? store.minTakenDate : placeholderDate;

  const handleCheckBox = event => {
    if (event.target.checked) {
      dispatch({
        type: SET_MIN_TAKEN_DATE,
        minTakenDate: format(selectedDate, "yyyy-MM-dd") //sql format readable by humans and flickr API
      });
    } else {
      dispatch({
        type: SET_MIN_TAKEN_DATE,
        minTakenDate: null
      });
    }
  };

  const handleDateChange = date => {
    selectedDate = date;
    setPlaceholderDate(date);
    dispatch({
      type: SET_MIN_TAKEN_DATE,
      minTakenDate: format(date, "yyyy-MM-dd")
    });
  };

  return (
    <div style={{ display: "flex" }}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          style={{ marginLeft: "0.5rem" }}
          disabled={!checked}
          margin="normal"
          id="date-picker-dialog"
          label="min taken date"
          format="dd/MM/yyyy"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </MuiPickersUtilsProvider>
      <Checkbox
        style={{ alignSelf: "flex-end", marginLeft: "1rem" }}
        checked={checked}
        onChange={handleCheckBox}
        value="min taken date"
        color="primary"
        inputProps={{
          "aria-label": "minimum taken date"
        }}
      />
    </div>
  );
}
