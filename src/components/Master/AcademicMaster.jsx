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
import ReactTabs from '../School/ReactTabs'
import { Home, User, Settings, Mail, Bell, TrendingUp, Award, Heart } from 'lucide-react';
import Permission from './Permission'

const AcademicMaster = () => {
    const tabs = [
      { id: 'Organization', label: 'Organization', icon: Home, color: '#6f42c1', component: <OrganizationMaster/> },
      { id: 'BankAccount', label: 'BankAccount', icon: User, color: '#0d6efd', component: <CreateBankAccount/> },
      { id: 'User', label: 'User', icon: Mail, color: '#0dcaf0', component: <User/> },
      { id: 'Permission', label: 'Permission', icon: Bell, color: '#ffc107', component: <Permission/> },
      { id: 'Branch', label: 'Branch', icon: TrendingUp, color: '#198754', component: <Branch/> },
      // { id: 'settings', label: 'Settings', icon: Settings, color: '#6c757d', component: <Subject/> },
    ];
  return (
    <div>
      {/* <StudentProfile/>
      <FeesPayment/>
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
      <Admission/>
      <Registration/> */}
      <ReactTabs tabs={tabs} />
    </div>
  )
}

export default AcademicMaster