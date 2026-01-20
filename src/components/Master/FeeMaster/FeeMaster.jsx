import React from 'react'
import { Home, User, Settings, Mail, Bell, TrendingUp, Award, Heart } from 'lucide-react';


import ReactTabs from '../../School/ReactTabs';
import CategoryMaster from './CategoryMaster';
import SubCategoryMaster from './SubCategoryMaster';
import ItemMaster from './ItemMaster';
import RateScheduleByCalss from './RateScheduleByCalss';
import ClassWiseItemRateMapping from './ClassWiseItemRateMapping';
import InsertMonthType from './InsertMonthType';
import ClassFeeMonthMapping from './ClassFeeMonthMapping';
import ClassWiseFeeRateMApping from './ClassWiseFeeRateMApping';

const FeeMaster = () => {
    const tabs = [
        { id: 'CategoryMaster', label: 'CategoryMaster', icon: User, color: '#0d6efd', component: <CategoryMaster /> },
        { id: 'SubCategoryMaster', label: 'SubCategoryMaster', icon: User, color: '#0d6efd', component: <SubCategoryMaster /> },
        { id: 'ItemMaster', label: 'ItemMaster', icon: User, color: '#0d6efd', component: <ItemMaster /> },
        { id: 'InsertMonthType', label: 'InsertMonthType', icon: User, color: '#0d6efd', component: <InsertMonthType /> },
        { id: 'ClassWiseFeeRateMApping', label: 'ClassWiseFeeRateMApping', icon: User, color: '#0d6efd', component: <ClassWiseFeeRateMApping /> },
        { id: 'Class Wise Items Mapping', label: 'Class Wise Items Mapping', icon: User, color: '#0d6efd', component: <ClassWiseItemRateMapping /> },
        // { id: 'ClassFeeMonthMapping', label: 'ClassFeeMonthMapping', icon: User, color: '#0d6efd', component: <ClassFeeMonthMapping /> },
    ];
    return (
        <div>

            <ReactTabs tabs={tabs} />
        </div>
    )
}

export default FeeMaster
