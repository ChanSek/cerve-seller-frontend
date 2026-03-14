import React from 'react';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

const MultiCheckbox = ({ options, state, onChange, id }) => {
  const handleChange = (e) => {
    const val = e.target.name;
    const currentValues = state[id] || [];

    if (currentValues.includes(val)) {
      onChange(id, currentValues.filter((item) => item !== val));
    } else {
      onChange(id, [...currentValues, val]);
    }
  };

  return (
    <div className="py-1 flex flex-col">
      <FormGroup row>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                sx={{
                  color: '#e0e0e0',
                  '&.Mui-checked': { color: '#6c5ce7' },
                }}
                onChange={handleChange}
                name={option.value}
                size="small"
                checked={state[id]?.includes(option.value) || false}
              />
            }
            label={
              <div style={{ fontSize: '14px', color: '#e0e0e0' }}>
                {option.label}
              </div>
            }
          />
        ))}
      </FormGroup>
    </div>
  );
};

export default MultiCheckbox;
