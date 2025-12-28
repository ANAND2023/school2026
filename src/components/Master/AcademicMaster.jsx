import React from 'react'
import CreateAcademicYear from './CreateAcademicYear'
import ClassMaster from './ClassMaster'
import SectionMaster from './SectionMaster'
import Subject from './Subject'
import Branch from './Branch'
import OrganizationMaster from './OrganizationMaster'
import CreateBankAccount from './FeeMaster/CreateBankAccount'
import CreateFeeConcession from './FeeMaster/CreateFeeConcession'
import CreateFeeHead from './FeeMaster/CreateFeeHead'
import CreateFeeStructure from './FeeMaster/CreateFeeStructure'
import CreateLateFeePenalty from './FeeMaster/CreateLateFeePenalty'
import CreatePaymentMode from './FeeMaster/CreatePaymentMode'
import CreateScholarship from './FeeMaster/CreateScholarship'
import CreateTax from './FeeMaster/CreateTax'
import FeesPayment from './FeeMaster/FeesPayment'
import Admission from '../Admission/Admission'
import Registration from '../Registration/Registration'
import StudentProfile from '../Student/StudentProfile'

const AcademicMaster = () => {
  return (
    <div>
      <StudentProfile/>
      <FeesPayment/>
      <CreateAcademicYear/>a
      <ClassMaster/>
      <SectionMaster/>
      <Subject/>
      <Branch/>
      <OrganizationMaster/>
      <CreateBankAccount/>
      <CreateFeeConcession/>
      <CreateFeeHead/>
      <CreateFeeStructure/>
      <CreateLateFeePenalty/>
      <CreatePaymentMode/>
      <CreateScholarship/>
      <CreateTax/>
      <Admission/>
      <Registration/>
    </div>
  )
}

export default AcademicMaster