import "date-fns";
import React, { useState, useContext } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { format } from "date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import Checkbox from "@material-ui/core/Checkbox";
import DispatchContext from "../../../context/dispatchContext";
import StateContext from "../../../context/stateContext";
import { SET_MAX_UPLOAD_DATE } from "../../../context/rootReducer";

export default function MaxUploadDatePicker(props) {
  const dispatch = useContext(DispatchContext);
  const store = useContext(StateContext);

  const [placeholderDate, setPlaceholderDate] = useState(new Date());

  const checked = store.maxUploadDate ? true : false;
  let selectedDate = checked ? store.maxUploadDate : placeholderDate;

  const handleCheckBox = event => {
    if (event.target.checked) {
      dispatch({
        type: SET_MAX_UPLOAD_DATE,
        maxUploadDate: format(selectedDate, "yyyy-MM-dd")
      });
    } else {
      dispatch({
        type: SET_MAX_UPLOAD_DATE,
        maxUploadDate: null
      });
    }
  };

  const handleDateChange = date => {
    selectedDate = date;
    setPlaceholderDate(date);
    dispatch({
      type: SET_MAX_UPLOAD_DATE,
      maxUploadDate: format(date, "yyyy-MM-dd")
    });
  };

  return (
    <div style={{ display: "flex" }}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          minDate={"2000,1,1"}
          style={{ marginLeft: "0.5rem" }}
          disabled={!checked}
          margin="normal"
          id="date-picker-dialog"
          label="max upload date"
          format="dd/MM/yyyy"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </MuiPickersUtilsProvider>
      <Checkbox
        style={{ alignSelf: "flex-end", marginLeft: "1rem" }}
        checked={checked}
        onChange={handleCheckBox}
        value="use max upload date"
        color="primary"
        inputProps={{
          "aria-label": "maximum upload date"
        }}
      />
    </div>
  );
}
