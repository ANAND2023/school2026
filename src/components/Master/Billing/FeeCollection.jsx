import React, { useState } from 'react'
import { notify } from '../../../utils/ustil2';
import { getadmissionlist } from '../../../networkServices/School/RegistrationApi';
import SearchComponent from '../../commonComponents/SearchComponent';
import Heading from '../../UI/Heading';

const FeeCollection = () => {

  const [studentData, setStudentData] = useState([]);

  console.log("studentData", studentData);  
  return (
    <div className='card'>
      <Heading title={"Fee Collection"} />

      
      {studentData?.length === 0 && <SearchComponent
        onClick={setStudentData}
      />}
    </div>
  )
}

export default FeeCollection