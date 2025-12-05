import React from 'react'
import LabeledInput from '../../components/formComponent/LabeledInput'
import { t } from 'i18next'
import Input from '../../components/formComponent/Input'

const PatientBasicDetails = ({ patientBaiscDetails }) => {
    debugger
    return (
        <div className="row p-2">
            <div className="col-xl-3 col-md-2 col-sm-4 col-12 pb-2 d-flex">
                <div className="w-xl-50  w-md-100 w-100">
                    <LabeledInput
                        label={t("Patient Name")}
                        value={patientBaiscDetails?.PatientName}
                    />
                </div>
            </div>
            <div className="col-xl-3 col-md-2 col-sm-4 col-12 pb-2 d-flex gap-2">
                <div className="w-xl-50  w-md-100 w-100">
                    <LabeledInput
                        label={t("UHID")}
                        value={patientBaiscDetails?.PatientID}
                    />
                </div>
               
            </div>
            <div className="col-xl-3 col-md-2 col-sm-4 col-12 pb-2 d-flex">
                <div className="w-xl-50  w-md-100 w-100">
                    <LabeledInput
                        label={t("Mobile No.")}
                        value={patientBaiscDetails?.Mobile}
                    />
                </div>
            </div>
            <div className="col-xl-3 col-md-2 col-sm-4 col-12 pb-2 d-flex">
                <div className="w-xl-50  w-md-100 w-100">
                    <LabeledInput
                        label={t("Alternate Mobile No.")}
                        value={patientBaiscDetails?.AlterNateMobileNo}
                    />
                </div>
            </div>
            <div className="col-xl-3 col-md-2 col-sm-4 col-12 pb-2 d-flex">
                <div className="w-xl-50  w-md-100 w-100">
                    <LabeledInput
                        label={t("Age/")}
                        value={`${patientBaiscDetails?.CurrentAge}/${patientBaiscDetails?.Gender}`}
                        valueLength={`${patientBaiscDetails?.CurrentAge}/${patientBaiscDetails?.Gender}`?.length}
                    />
                </div>
            </div>
            <div className="col-xl-3 col-md-2 col-sm-4 col-12 pb-2 d-flex">
                <div className="w-xl-50  w-md-100 w-100">
                    <LabeledInput
                        label={t("Ward Details")}
                        value={patientBaiscDetails?.RoomNo}
                    />
                </div>
            </div>
            <div className="col-xl-3 col-md-2 col-sm-4 col-12 pb-2 d-flex">
                <div className="w-xl-50  w-md-100 w-100">
                    <LabeledInput
                        label={t("Admit Date")}
                        value={patientBaiscDetails?.DateOfAdmit}
                    />
                </div>
            </div>
            <div className="col-xl-3 col-md-2 col-sm-4 col-12 pb-2 d-flex">
                <div className="w-xl-50  w-md-100 w-100">
                    <LabeledInput
                        label={t("Discharge Date")}
                        value={patientBaiscDetails?.DateOfDischarge}
                    />
                </div>
            </div>
            <div className="col-xl-6 col-md-2 col-sm-4 col-12 pb-2 d-flex">
                <div className="w-xl-50  w-md-100 w-100">
                    <LabeledInput
                        label={t("Kin Relation")}
                        value={patientBaiscDetails?.PatientRelation}
                        valueLength={patientBaiscDetails?.PatientRelation?.length +1}
                    />
                </div>
            </div>
            <div className="col-xl-6 col-md-2 col-sm-4 col-12 pb-2 d-flex">
                <div className="w-xl-50  w-md-100 w-100">
                    <LabeledInput
                        label={t("Patient Relation Phone")}
                        value={patientBaiscDetails?.PatientRelationPhone}
                        valueLength={patientBaiscDetails?.PatientRelationPhone?.length +1}
                    />
                </div>
            </div>
            <div className="col-xl-12 col-md-6 col-sm-8 col-12 pb-2 d-flex">
                <div className="w-xl-50  w-md-100 w-100">
                    <LabeledInput
                        label={t("Address")}
                        value={patientBaiscDetails?.Address}
                        valueLength={patientBaiscDetails?.Address?.length}
                    />
                </div>
            </div>
        </div>
    )
}

export default PatientBasicDetails