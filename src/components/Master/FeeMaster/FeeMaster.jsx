import React from 'react'
import { Home, User, Settings, Mail, Bell, TrendingUp, Award, Heart } from 'lucide-react';


import ReactTabs from '../../School/ReactTabs';
import CategoryMaster from './CategoryMaster';
import SubCategoryMaster from './SubCategoryMaster';
import ItemMaster from './ItemMaster';

const FeeMaster = () => {
    const tabs = [
        { id: 'CategoryMaster', label: 'CategoryMaster', icon: User, color: '#0d6efd', component: <CategoryMaster /> },
        { id: 'SubCategoryMaster', label: 'SubCategoryMaster', icon: User, color: '#0d6efd', component: <SubCategoryMaster /> },
        { id: 'ItemMaster', label: 'ItemMaster', icon: User, color: '#0d6efd', component: <ItemMaster /> },
    ];
    return (
        <div>

            <ReactTabs tabs={tabs} />
        </div>
    )
}

export default FeeMaster
