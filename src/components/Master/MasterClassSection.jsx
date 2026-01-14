import React from 'react'
// import MenuBulk from './MenuBulk'
// import SubMenuBulk from './SubMenuBulk'
// import ModuleBulk from '../ModuleMaster/ModuleBulk'

import { Home, User, Settings, Mail, Bell, TrendingUp, Award, Heart } from 'lucide-react';
import ClassMaster from './ClassMaster';
import ReactTabs from '../School/ReactTabs';
import SectionMaster from './SectionMaster';
import SubjectClassMapping from './SubjectClassMapping';
import Subject from './Subject';
// import Users from '../Users'

const MasterClassSection = () => {
  const tabs = [
    { id: 'ClassMaster', label: 'ClassMaster', icon: Home, color: '#6f42c1', component: <ClassMaster /> },
    { id: 'SectionMaster', label: 'SectionMaster', icon: Home, color: '#6f42c1', component: <SectionMaster /> },
    { id: 'Subject', label: 'Subject', icon: Home, color: '#6f42c1', component: <Subject /> },
    { id: 'SubjectClassMapping', label: 'SubjectClassMapping', icon: Home, color: '#6f42c1', component: <SubjectClassMapping /> },
    // { id: 'Menu', label: 'Menu', icon: Home, color: '#6f42c1', component: <MenuBulk /> },
    // // { id: 'BankAccount', label: 'BankAccount', icon: User, color: '#0d6efd', component: <CreateBankAccount/> },
    // { id: 'SubMenu', label: 'SubMenu', icon: User, color: '#0d6efd', component: <SubMenuBulk /> },
    // // { id: 'ModuleSubMenuMap', label: 'ModuleSubMenuMap', icon: User, color: '#0d6efd', component: <ModuleSubMenuMap /> },
    // { id: 'Users', label: 'Users', icon: User, color: '#0d6efd', component: <Users /> },
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

export default MasterClassSection

