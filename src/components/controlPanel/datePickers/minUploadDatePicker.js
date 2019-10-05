import "date-fns";
import React, { useState, useContext } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { format } from "date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import Checkbox from "@material-ui/core/Checkbox";
import StateContext from "../../../context/stateContext";
import DispatchContext from "../../../context/dispatchContext";
import { SET_MIN_UPLOAD_DATE } from "../../../context/rootReducer";

export default function MinUploadDatePicker(props) {
  const store = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  /** placeholderDate is used:
   * 1) As initial date at the initialization of the component
   * 2) As a placeholder when the user unchecks the checkbox
   * so that the date doesn't reset each time after disabling the datepicker
   * current implementation won't work on mobile because:
   * when the drawer is closed the datepickers are unmounted and its state is wiped
   * -initial minUploadDate is set to Flickrs official launch year 2004
   */
  const [placeholderDate, setPlaceholderDate] = useState(new Date(2004, 1, 1));

  const checked = store.minUploadDate ? true : false;
  let selectedDate = checked ? store.minUploadDate : placeholderDate;

  const handleCheckBox = event => {
    if (event.target.checked) {
      dispatch({
        type: SET_MIN_UPLOAD_DATE,
        minUploadDate: format(selectedDate, "yyyy-MM-dd")
      });
    } else {
      dispatch({
        type: SET_MIN_UPLOAD_DATE,
        minUploadDate: null
      });
    }
  };

  const handleDateChange = date => {
    selectedDate = date;
    setPlaceholderDate(date);
    dispatch({
      type: SET_MIN_UPLOAD_DATE,
      minUploadDate: format(date, "yyyy-MM-dd") //sql format, also works with flickr api and unlike getUnixTime(date) is readable
    });
  };

  return (
    <div style={{ display: "flex" }}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          minDate={"2000,1,1"}
          style={{ marginLeft: "0.5rem" }}
          disabled={!checked}
          margin="normal"
          id="date-picker-dialog"
          label="min upload date"
          format="dd/MM/yyyy"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date"
          }}
        />
      </MuiPickersUtilsProvider>
      <Checkbox
        style={{ alignSelf: "flex-end", marginLeft: "1rem" }}
        checked={checked}
        onChange={handleCheckBox}
        value="min upload date"
        color="primary"
        inputProps={{
          "aria-label": "minimum upload date"
        }}
      />
    </div>
  );
}
