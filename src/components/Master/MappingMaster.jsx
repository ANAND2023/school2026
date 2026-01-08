import React from 'react'


import { Home, User, Settings, Mail, Bell, TrendingUp, Award, Heart } from 'lucide-react';
import EmployeeBranchMap from './BranchMaster/EmployeeBranchMapping';
import ModuleEmployeeMapping from './BranchMaster/ModuleEmployeeMapping';
import ReactTabs from '../School/ReactTabs';
import ModuleSubmenuMapping from './BranchMaster/ModuleSubmenuMapping';
import EmployeeSubMenuMapping from './BranchMaster/EmployeeSubMenuMapping';

const MappingMaster = () => {
      const tabs = [
    //   { id: 'Module', label: 'Module', icon: Home, color: '#6f42c1', component: <ModuleBulk/> },
    //   { id: 'Menu', label: 'Menu', icon: Home, color: '#6f42c1', component: <MenuBulk/> },
    //   // { id: 'BankAccount', label: 'BankAccount', icon: User, color: '#0d6efd', component: <CreateBankAccount/> },
    //   { id: 'SubMenu', label: 'SubMenu', icon: User, color: '#0d6efd', component: <SubMenuBulk/> },
    //   { id: 'Users', label: 'Users', icon: User, color: '#0d6efd', component: <Users/> },
      { id: 'EmployeeBranchMap', label: 'EmployeeBranchMap', icon: User, color: '#0d6efd', component: <EmployeeBranchMap/> },
      { id: 'ModuleEmployeeMapping', label: 'ModuleEmployeeMapping', icon: User, color: '#0d6efd', component: <ModuleEmployeeMapping/> },
      { id: 'ModuleSubmenuMapping', label: 'ModuleSubmenuMapping', icon: User, color: '#0d6efd', component: <ModuleSubmenuMapping/> },
      { id: 'EmployeeSubMenuMapping', label: 'EmployeeSubMenuMapping', icon: User, color: '#0d6efd', component: <EmployeeSubMenuMapping/> },
      // { id: 'User', label: 'User', icon: Mail, color: '#0dcaf0', component: <User/> },
      // { id: 'Permission', label: 'Permission', icon: Bell, color: '#ffc107', component: <Permission/> },
      // { id: 'Branch', label: 'Branch', icon: TrendingUp, color: '#198754', component: <Branch/> },
      // // { id: 'settings', label: 'Settings', icon: Settings, color: '#6c757d', component: <Subject/> },
    ];
  return (
    <div>
{/* <AllRegistration/>
<StudentRegistration/> */}
 
 <ReactTabs tabs={tabs} />
    </div>
  )
}

export default MappingMaster
