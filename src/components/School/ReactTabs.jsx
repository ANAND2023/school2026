import React, { useState } from 'react';
import { Home } from 'lucide-react';

export default function ReactTabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.id || 'home');

  const activeColor = tabs?.find(t => t.id === activeTab)?.color || '#6f42c1';
  const activeTabData = tabs?.find(t => t.id === activeTab);

  return (
    <div>
      <div>
        {/* Main Card */}
        <div>
          {/* Bootstrap Tabs Navigation */}
          <ul className="nav nav-tabs" style={{ 
            background: 'linear-gradient(to right, #f8f9fa, #e9ecef)', 
            borderBottom: 'none',
            padding: '10px',
            display: 'flex',
            flexWrap: 'wrap'
          }}>
            {tabs?.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <li className="nav-item" key={tab.id} style={{ margin: '5px' }}>
                  <button
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      background: isActive ? 'white' : 'transparent',
                      color: isActive ? tab.color : '#6c757d',
                      boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                      transform: isActive ? 'translateY(-2px)' : 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Tab Content */}
          <div className="tab-content" style={{ padding: '20px' }}>
            <div className="tab-pane fade show active">
              {/* Render Active Tab Component */}
              {activeTabData?.component ? (
                <div style={{
                  animation: 'fadeIn 0.3s ease-in-out'
                }}>
                  {activeTabData.component}
                </div>
              ) : (
                <div style={{ 
                  padding: '40px',
                  textAlign: 'center',
                  color: '#6c757d'
                }}>
                  <p>No component available for this tab</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap CSS CDN */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css" 
        rel="stylesheet" 
      />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}


// import React, { useState } from 'react';
// import { Home, User, Settings, Mail, Bell, TrendingUp, Award, Heart } from 'lucide-react';

// export default function ReactTabs() {
//   const [activeTab, setActiveTab] = useState('home');

//   const tabs = [
//     { id: 'home', label: 'Home', icon: Home, color: '#6f42c1' },
//     { id: 'profile', label: 'Profile', icon: User, color: '#0d6efd' },
//     { id: 'messages', label: 'Messages', icon: Mail, color: '#0dcaf0' },
//     { id: 'notifications', label: 'Notifications', icon: Bell, color: '#ffc107' },
//     { id: 'analytics', label: 'Analytics', icon: TrendingUp, color: '#198754' },
//     { id: 'settings', label: 'Settings', icon: Settings, color: '#6c757d' },
//   ];

//   const tabContent = {
//     home: {
//       title: 'Welcome Home',
//       subtitle: 'Aapka personal dashboard',
//       description: 'Yahan aap apni sabhi important activities dekh sakte hain.',
//       badge: 'New',
//       stats: [
//         { label: 'Total Views', value: '2,543', icon: TrendingUp },
//         { label: 'Achievements', value: '12', icon: Award },
//         { label: 'Favorites', value: '89', icon: Heart }
//       ]
//     },
//     profile: {
//       title: 'User Profile',
//       subtitle: 'Apni information manage karein',
//       description: 'Profile details, settings aur preferences yahan update kar sakte hain.',
//       badge: 'Active',
//       stats: [
//         { label: 'Posts', value: '245', icon: Mail },
//         { label: 'Followers', value: '1.2K', icon: User },
//         { label: 'Following', value: '580', icon: User }
//       ]
//     },
//     messages: {
//       title: 'Messages',
//       subtitle: 'Apne messages dekhen',
//       description: 'Real-time messaging aur chat history yahan available hai.',
//       badge: '5 Unread',
//       stats: [
//         { label: 'Inbox', value: '42', icon: Mail },
//         { label: 'Sent', value: '128', icon: Mail },
//         { label: 'Drafts', value: '7', icon: Mail }
//       ]
//     },
//     notifications: {
//       title: 'Notifications',
//       subtitle: 'Latest updates',
//       description: 'Important alerts aur system notifications yahan milenge.',
//       badge: '8 New',
//       stats: [
//         { label: 'Today', value: '15', icon: Bell },
//         { label: 'This Week', value: '64', icon: Bell },
//         { label: 'All Time', value: '892', icon: Bell }
//       ]
//     },
//     analytics: {
//       title: 'Analytics Dashboard',
//       subtitle: 'Performance insights',
//       description: 'Detailed statistics aur growth metrics yahan track karein.',
//       badge: 'Updated',
//       stats: [
//         { label: 'Revenue', value: '₹45K', icon: TrendingUp },
//         { label: 'Growth', value: '+23%', icon: TrendingUp },
//         { label: 'Users', value: '3.4K', icon: User }
//       ]
//     },
//     settings: {
//       title: 'Settings',
//       subtitle: 'Configure preferences',
//       description: 'Account settings, privacy options aur customization yahan karein.',
//       badge: 'Updated',
//       stats: [
//         { label: 'Active', value: '6', icon: Settings },
//         { label: 'Pending', value: '2', icon: Settings },
//         { label: 'Archived', value: '14', icon: Settings }
//       ]
//     }
//   };

//   const activeColor = tabs.find(t => t.id === activeTab)?.color || '#6f42c1';

//   return (
//     <div 
//     // style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px' }}
//     >
//       <div
//       //  style={{ maxWidth: '1200px', margin: '0 auto' }}
//        >
      

//         {/* Main Card */}
//         <div 
//         // style={{ background: 'white', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden' }}
//         >
          
//           {/* Bootstrap Tabs Navigation */}
//           <ul className="nav nav-tabs" style={{ 
//             background: 'linear-gradient(to right, #f8f9fa, #e9ecef)', 
//             borderBottom: 'none',
//             padding: '10px',
//             display: 'flex',
//             flexWrap: 'wrap'
//           }}>
//             {tabs?.map((tab) => {
//               const Icon = tab.icon;
//               const isActive = activeTab === tab.id;
//               return (
//                 <li className="nav-item" key={tab.id} style={{ margin: '5px' }}>
//                   <button
//                     className={`nav-link ${isActive ? 'active' : ''}`}
//                     onClick={() => setActiveTab(tab.id)}
//                     style={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '8px',
//                       padding: '12px 24px',
//                       border: 'none',
//                       borderRadius: '12px',
//                       fontWeight: '600',
//                       transition: 'all 0.3s ease',
//                       background: isActive ? 'white' : 'transparent',
//                       color: isActive ? tab.color : '#6c757d',
//                       boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
//                       transform: isActive ? 'translateY(-2px)' : 'none',
//                       cursor: 'pointer'
//                     }}
//                   >
//                     <Icon size={20} />
//                     <span>{tab.label}</span>
//                   </button>
//                 </li>
//               );
//             })}
//           </ul>

//           {/* Tab Content */}
//           <div className="tab-content" style={{ padding: '40px' }}>
//             <div className="tab-pane fade show active">
//               {/* Content Header */}
//               <div style={{ display: 'flex', alignItems: 'start', gap: '20px', marginBottom: '30px' }}>
//                 {React.createElement(tabs.find(t => t.id === activeTab)?.icon || Home, {
//                   size: 64,
//                   style: { color: activeColor, minWidth: '64px' }
//                 })}
//                 <div style={{ flex: 1 }}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
//                     <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#212529', margin: 0 }}>
//                       {tabContent[activeTab].title}
//                     </h2>
//                     <span className="badge" style={{ 
//                       background: activeColor, 
//                       color: 'white',
//                       padding: '6px 12px',
//                       borderRadius: '20px',
//                       fontSize: '0.8rem'
//                     }}>
//                       {tabContent[activeTab].badge}
//                     </span>
//                   </div>
//                   <p style={{ fontSize: '1.3rem', color: activeColor, fontWeight: '500', margin: '8px 0' }}>
//                     {tabContent[activeTab].subtitle}
//                   </p>
//                   <p style={{ fontSize: '1.1rem', color: '#6c757d', margin: 0 }}>
//                     {tabContent[activeTab].description}
//                   </p>
//                 </div>
//               </div>

//               {/* Alert Box */}
//               <div className="alert" style={{ 
//                 background: `linear-gradient(135deg, ${activeColor}15, ${activeColor}05)`,
//                 border: `2px solid ${activeColor}40`,
//                 borderRadius: '15px',
//                 padding: '20px',
//                 marginBottom: '30px'
//               }}>
//                 <h5 style={{ color: activeColor, fontWeight: 'bold', marginBottom: '10px' }}>
//                   💡 Quick Tip
//                 </h5>
//                 <p style={{ color: '#495057', margin: 0 }}>
//                   Is section mein aap apni productivity badha sakte hain. Explore karein aur features ka use karein!
//                 </p>
//               </div>

//               {/* Stats Cards */}
//               <div className="row g-4">
//                 {tabContent[activeTab].stats.map((stat, index) => {
//                   const StatIcon = stat.icon;
//                   return (
//                     <div className="col-md-4" key={index}>
//                       <div className="card" style={{ 
//                         border: 'none',
//                         borderRadius: '15px',
//                         background: `linear-gradient(135deg, ${activeColor}10, white)`,
//                         boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
//                         transition: 'transform 0.3s ease',
//                         cursor: 'pointer',
//                         height: '100%'
//                       }}
//                       onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
//                       onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
//                       >
//                         <div className="card-body" style={{ padding: '25px' }}>
//                           <div style={{ 
//                             width: '50px', 
//                             height: '50px', 
//                             borderRadius: '12px', 
//                             background: activeColor,
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             marginBottom: '15px'
//                           }}>
//                             <StatIcon size={28} color="white" />
//                           </div>
//                           <h6 style={{ color: '#6c757d', fontSize: '0.9rem', marginBottom: '8px' }}>
//                             {stat.label}
//                           </h6>
//                           <h3 style={{ color: activeColor, fontWeight: 'bold', fontSize: '2rem', margin: 0 }}>
//                             {stat.value}
//                           </h3>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Action Buttons */}
//               <div style={{ marginTop: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
//                 <button className="btn btn-lg" style={{ 
//                   background: activeColor,
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '12px',
//                   padding: '12px 30px',
//                   fontWeight: '600',
//                   boxShadow: `0 4px 15px ${activeColor}40`
//                 }}>
//                   Primary Action
//                 </button>
//                 <button className="btn btn-lg btn-outline-secondary" style={{ 
//                   borderRadius: '12px',
//                   padding: '12px 30px',
//                   fontWeight: '600',
//                   borderWidth: '2px'
//                 }}>
//                   Secondary Action
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div style={{ textAlign: 'center', marginTop: '30px', color: 'white', opacity: 0.9 }}>
//           <p style={{ margin: 0 }}>✨ Bootstrap + React se banaya gaya beautiful UI</p>
//         </div>
//       </div>

//       {/* Bootstrap CSS CDN */}
//       <link 
//         href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css" 
//         rel="stylesheet" 
//       />
//     </div>
//   );
// }