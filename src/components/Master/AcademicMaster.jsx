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

const AcademicMaster = () => {
  return (
    <div>
      <CreateAcademicYear/>
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
    </div>
  )
}

export default AcademicMaster