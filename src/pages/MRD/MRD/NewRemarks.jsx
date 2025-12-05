import React from 'react'
import TextAreaInput from '../../../components/formComponent/TextAreaInput';
import DatePicker from '../../../components/formComponent/DatePicker';
import TimePicker from '../../../components/formComponent/TimePicker';
import moment from 'moment';

const NewRemarks = ({ formValues, setFormValues }) => {
    const { VITE_DATE_FORMAT } = import.meta.env;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const preventDate = moment(formValues?.IssueDate, "DD-MMM-YYYY hh:mmA").toDate();



    return (
        <div className=''>
            <div className="d-sm-flex p-0 mb-2">
                <DatePicker
                    className="custom-calendar"
                    placeholder={VITE_DATE_FORMAT}
                    lable={"Receive Date"}
                    respclass="col-xl-6 col-md-6 col-sm-6 col-12"
                    name="receiveDate"
                    value={formValues?.receiveDate? formValues?.receiveDate: new Date()}
                    minDate={preventDate}
                    id="receiveDate"
                    handleChange={handleChange}
                />
                <TimePicker
                    lable={"Receive Time"}
                    respclass="col-xl-6 col-md-6 col-sm-6 col-12"
                    name="receiveTime"
                    id="receiveTime"
                    value={formValues?.receiveTime || new Date()}
                    handleChange={handleChange}
                />
            </div>

            <TextAreaInput
                name="newRemarks"
                value={formValues?.newRemarks}
                onChange={handleChange}
                lable="Enter Remarks"
                className="mt-2"
                id="newRemarks"
                rows={4}
                respclass="col-xl-12 col-md-12 col-sm-12 col-12"
            />
        </div>
    );
};

export default NewRemarks