import React from 'react'
import MenuBulk from './MenuBulk'
import SubMenuBulk from './SubMenuBulk'
import ModuleBulk from '../ModuleMaster/ModuleBulk'
import ModuleEmployeeMap from '../ModuleMaster/ModuleEmployeeMap'
import SubMenuEmployeeMapping from './SubMenuEmployeeMapping'
import ModuleSubMenuMap from '../ModuleMaster/ModelSubMenuMap'

const Menu = () => {
  return (
    <div>
        <MenuBulk/>
        <SubMenuEmployeeMapping/>
        <SubMenuBulk/>
<ModuleBulk/>
<ModuleEmployeeMap/>
<ModuleSubMenuMap/>
    </div>
  )
}

export default Menu