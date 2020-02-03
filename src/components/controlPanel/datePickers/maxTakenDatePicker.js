import "date-fns";
import React, { useState, useContext } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { format } from "date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import Checkbox from "@material-ui/core/Checkbox";
import QueryContext from "../../../context/QueryContext/queryContext";
import DispatchQueryContext from "../../../context/QueryContext/dispatchQueryContext";
import { SET_MAX_TAKEN_DATE } from "../../../context/QueryContext/queryReducer";

export default function MaxTakenDatePicker(props) {
  const dispatch = useContext(DispatchQueryContext);
  const store = useContext(QueryContext);

  const [placeholderDate, setPlaceholderDate] = useState(new Date());

  const checked = store.maxTakenDate ? true : false;
  let selectedDate = checked ? store.maxTakenDate : placeholderDate;

  const handleCheckBox = event => {
    if (event.target.checked) {
      dispatch({
        type: SET_MAX_TAKEN_DATE,
        maxTakenDate: format(selectedDate, "yyyy-MM-dd")
      });
    } else {
      dispatch({
        type: SET_MAX_TAKEN_DATE,
        maxTakenDate: false
      });
    }
  };

  const handleDateChange = date => {
    selectedDate = date;
    setPlaceholderDate(date);
    dispatch({
      type: SET_MAX_TAKEN_DATE,
      maxTakenDate: format(date, "yyyy-MM-dd")
    });
  };

  return (
    <div style={{ display: "flex" }}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          style={{ marginLeft: "0.5rem" }}
          disabled={!checked}
          margin="normal"
          // id="date-picker-dialog"
          label="max taken date"
          format="dd/MM/yyyy"
          value={selectedDate}
          onChange={date => handleDateChange(date)}
        />
      </MuiPickersUtilsProvider>
      <Checkbox
        style={{ alignSelf: "flex-end", marginLeft: "1rem" }}
        checked={checked}
        onChange={handleCheckBox}
        value="max taken date"
        color="primary"
        inputProps={{
          "aria-label": "maximum taken date"
        }}
      />
    </div>
  );
}
