import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Settings, FileText, ShieldAlert, Users, UserCircle, Wifi, WifiOff } from 'lucide-react';
import clsx from 'clsx';
import { usePrison } from '../context/PrisonContext';

const Sidebar = () => {
  const { settings } = usePrison();
  
  // Herhangi bir cihaz bağlı mı kontrol et
  const isAnyDeviceConnected = settings.devices.some(d => d.status === 'connected');

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Kontrol Paneli' },
    { to: '/inmates', icon: Users, label: 'Mahkumlar' },
    { to: '/reports', icon: FileText, label: 'Raporlar' },
    { to: '/settings', icon: Settings, label: 'Ayarlar' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 border-r border-slate-800 z-20">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg shrink-0">
          <ShieldAlert className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-[11px] leading-tight text-white tracking-wide">
            ORDU E TİPİ<br />
            AÇIK CEZA<br />
            İNFAZ KURUMU
          </h1>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / Profile Section */}
      <div className="p-4 border-t border-slate-800 space-y-4">
        {/* Ahmet YURTGAN Section */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
            <UserCircle className="w-6 h-6 text-slate-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">Ahmet YURTGAN</p>
            <p className="text-[10px] text-slate-400 truncate uppercase tracking-wider">Elektrik Teknisyeni</p>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-slate-800 rounded-lg p-3 space-y-2">
          <div>
            <p className="text-xs text-slate-400 mb-1">Sistem Durumu</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-medium text-green-400">Online</span>
            </div>
          </div>
          
          <div className="pt-2 border-t border-slate-700">
             <p className="text-xs text-slate-400 mb-1">ZKTeco Cihazlar</p>
             <div className="flex items-center gap-2">
                {isAnyDeviceConnected ? (
                  <>
                    <Wifi className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400">Bağlı</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-red-400" />
                    <span className="text-xs text-red-400">Bağlantı Yok</span>
                  </>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
