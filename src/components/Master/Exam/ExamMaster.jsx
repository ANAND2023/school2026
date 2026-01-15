import React from 'react'


import { Home, User, Settings, Mail, Bell, TrendingUp, Award, Heart } from 'lucide-react';

import CreateTerm from './CreateTerm';
import ExamType from './ExamType';
import CreateExam from './CreateExam';
import ExamTimetable from './ExamTimetable';
import ReactTabs from '../../School/ReactTabs';
import MarksUpload from './MarksUpload';
const ExamMaster = () => {
      const tabs = [
    //   { id: 'Module', label: 'Module', icon: Home, color: '#6f42c1', component: <ModuleBulk/> },
    //   { id: 'Menu', label: 'Menu', icon: Home, color: '#6f42c1', component: <MenuBulk/> },
    //   // { id: 'BankAccount', label: 'BankAccount', icon: User, color: '#0d6efd', component: <CreateBankAccount/> },
    //   { id: 'SubMenu', label: 'SubMenu', icon: User, color: '#0d6efd', component: <SubMenuBulk/> },
    //   { id: 'Users', label: 'Users', icon: User, color: '#0d6efd', component: <Users/> },
      { id: 'CreateTerm', label: 'CreateTerm', icon: User, color: '#0d6efd', component: <CreateTerm/> },
      { id: 'ExamType', label: 'ExamType', icon: User, color: '#0d6efd', component: <ExamType/> },
      { id: 'CreateExam', label: 'CreateExam', icon: User, color: '#0d6efd', component: <CreateExam/> },
      { id: 'ExamTimetable', label: 'ExamTimetable', icon: User, color: '#0d6efd', component: <ExamTimetable/> },
      { id: 'MarksUpload', label: 'MarksUpload', icon: User, color: '#0d6efd', component: <MarksUpload/> },
      // { id: 'User', label: 'User', icon: Mail, color: '#0dcaf0', component: <User/> },
      // { id: 'Permission', label: 'Permission', icon: Bell, color: '#ffc107', component: <Permission/> },
      // { id: 'Branch', label: 'Branch', icon: TrendingUp, color: '#198754', component: <Branch/> },
      // // { id: 'settings', label: 'Settings', icon: Settings, color: '#6c757d', component: <Subject/> },
    ];
  return (
    <div>
 <ReactTabs tabs={tabs} />
    </div>
  )
}

export default ExamMaster
