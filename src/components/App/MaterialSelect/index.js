import React from 'react';
import { FormControl, Select, MenuItem, InputLabel } from '@material-ui/core';
import { IS_SELECTED } from '../../../constant';
import './index.scss';

const MaterialSelect = ({ items, handleChange, label, disabled = false }) => {
  const getSelectedItem = items.find(item => item[IS_SELECTED]).id;
  const onChange = evt => handleChange(evt.target.value);

  return (
    <div className="select-root">
      <FormControl className="form-control" disabled={disabled}>
        <InputLabel>{label}</InputLabel>
        <Select value={getSelectedItem} onChange={onChange}>
          {items.map(item => {
            return (
              <MenuItem key={`menu-item-for-${item.id}`} value={item.id}>
                {item.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
};

export default MaterialSelect;
