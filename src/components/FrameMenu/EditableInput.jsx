import React, { useState, useEffect } from 'react';
import Input from '../formComponent/Input';


const EditableInput = ({ initialValue, onSave, inputProps }) => {
  const [value, setValue] = useState(initialValue);


  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleBlur = () => {
    
    onSave(value);
  };

  return (
    <Input
      type="text"
      className="table-input"
      removeFormGroupClass={true}
      value={value || ''}
      onChange={handleChange}
      onBlur={handleBlur}
      {...inputProps}
    />
  );
};

export default EditableInput;