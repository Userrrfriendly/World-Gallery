import React from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

export default function HideFavoritesSwitch() {
  const [checked, setChecked] = React.useState(true);

  const handleSwitchChange = event => {
    setChecked(event.target.checked);
  };

  return (
    <FormGroup row style={{ justifyContent: "center" }}>
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            onChange={handleSwitchChange}
            value={checked}
          />
        }
        label="Hide all favorites from the map"
      />
    </FormGroup>
  );
}
