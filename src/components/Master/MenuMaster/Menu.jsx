import React from 'react'
import MenuBulk from './MenuBulk'
import SubMenuBulk from './SubMenuBulk'
import ModuleBulk from '../ModuleMaster/ModuleBulk'

import ReactTabs from '../../School/ReactTabs'
import { Home, User, Settings, Mail, Bell, TrendingUp, Award, Heart } from 'lucide-react';
import Users from '../Users'

const Menu = () => {
  const tabs = [
    { id: 'Module', label: 'Module', icon: Home, color: '#6f42c1', component: <ModuleBulk /> },
    { id: 'Menu', label: 'Menu', icon: Home, color: '#6f42c1', component: <MenuBulk /> },
    // { id: 'BankAccount', label: 'BankAccount', icon: User, color: '#0d6efd', component: <CreateBankAccount/> },
    { id: 'SubMenu', label: 'SubMenu', icon: User, color: '#0d6efd', component: <SubMenuBulk /> },
    // { id: 'ModuleSubMenuMap', label: 'ModuleSubMenuMap', icon: User, color: '#0d6efd', component: <ModuleSubMenuMap /> },
    { id: 'Users', label: 'Users', icon: User, color: '#0d6efd', component: <Users /> },
    // { id: 'EmployeeBranchMap', label: 'EmployeeBranchMap', icon: User, color: '#0d6efd', component: <EmployeeBranchMap /> },
    // { id: 'ModuleEmployeeMapping', label: 'ModuleEmployeeMapping', icon: User, color: '#0d6efd', component: <ModuleEmployeeMapping /> },
    // { id: 'User', label: 'User', icon: Mail, color: '#0dcaf0', component: <User/> },
    // { id: 'Permission', label: 'Permission', icon: Bell, color: '#ffc107', component: <Permission/> },
    // { id: 'Branch', label: 'Branch', icon: TrendingUp, color: '#198754', component: <Branch/> },
    // // { id: 'settings', label: 'Settings', icon: Settings, color: '#6c757d', component: <Subject/> },
  ];
  return (
    <div>
    
      {/* <ModuleSubMenuMap /> */}
      <ReactTabs tabs={tabs} />
    </div>
  )
}

export default Menu



// import React from 'react'
// import CreateAcademicYear from './CreateAcademicYear'
// import ClassMaster from './ClassMaster'
// import SectionMaster from './SectionMaster'
// import Subject from './Subject'
// import Branch from './Branch'
// import OrganizationMaster from './OrganizationMaster'
// import CreateBankAccount from './FeeMaster/CreateBankAccount'
// import CreateFeeConcession from './FeeMaster/CreateFeeConcession'
// import CreateFeeHead from './FeeMaster/CreateFeeHead'
// import CreateFeeStructure from './FeeMaster/CreateFeeStructure'
// import CreateLateFeePenalty from './FeeMaster/CreateLateFeePenalty'
// import CreatePaymentMode from './FeeMaster/CreatePaymentMode'
// import CreateScholarship from './FeeMaster/CreateScholarship'
// import CreateTax from './FeeMaster/CreateTax'
// import FeesPayment from './FeeMaster/FeesPayment'
// import Admission from '../Admission/Admission'
// import Registration from '../Registration/Registration'
// import StudentProfile from '../Student/StudentProfile'
// import ReactTabs from '../School/ReactTabs'
// import { Home, User, Settings, Mail, Bell, TrendingUp, Award, Heart } from 'lucide-react';
// import Permission from './Permission'
// import ModuleBulk from './ModuleMaster/ModuleBulk'

// const AcademicMaster = () => {
//     const tabs = [
//       { id: 'Organization', label: 'Organization', icon: Home, color: '#6f42c1', component: <OrganizationMaster/> },
//       // { id: 'BankAccount', label: 'BankAccount', icon: User, color: '#0d6efd', component: <CreateBankAccount/> },
//       { id: 'Branch', label: 'Branch', icon: User, color: '#0d6efd', component: <ModuleBulk/> },
//       { id: 'User', label: 'User', icon: Mail, color: '#0dcaf0', component: <User/> },
//       { id: 'Permission', label: 'Permission', icon: Bell, color: '#ffc107', component: <Permission/> },
//       { id: 'Branch', label: 'Branch', icon: TrendingUp, color: '#198754', component: <Branch/> },
//       // { id: 'settings', label: 'Settings', icon: Settings, color: '#6c757d', component: <Subject/> },
//     ];
//   return (
//     <div>
//       {/* <StudentProfile/> */}
//       {/* <FeesPayment/> */}
//       {/* <CreateAcademicYear/> */}
//       {/* <ClassMaster/>
//       <SectionMaster/>
//       <Subject/>
//       <Branch/>
//       <OrganizationMaster/>
//       <CreateBankAccount/>
//       <CreateFeeConcession/>
//       <CreateFeeHead/>
//       <CreateFeeStructure/>
//       <CreateLateFeePenalty/>
//       <CreatePaymentMode/>
//       <CreateScholarship/>
//       <CreateTax/>
//       <Admission/>
//       <Registration/> */}
//       <ReactTabs tabs={tabs} />
//     </div>
//   )
// }

// export default AcademicMaster