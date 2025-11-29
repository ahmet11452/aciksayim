import React, { useState } from 'react';
import { usePrison } from '../context/PrisonContext';
import { Save, Monitor, Clock, RefreshCw, Power, Wifi, Database, AlertTriangle } from 'lucide-react';
import { CountSchedule, DeviceConfig } from '../types';
import clsx from 'clsx';
import { format } from 'date-fns';

const Settings = () => {
  const { settings, updateSettings, connectDevice, disconnectDevice, syncDeviceData } = usePrison();
  const [localSchedules, setLocalSchedules] = useState<CountSchedule[]>(settings.schedules);
  const [localDevices, setLocalDevices] = useState<DeviceConfig[]>(settings.devices);
  const [activeTab, setActiveTab] = useState<'schedule' | 'device'>('device');

  const handleSave = () => {
    updateSettings({
      schedules: localSchedules,
      devices: localDevices,
    });
    alert('Ayarlar başarıyla kaydedildi!');
  };

  const updateSchedule = (id: number, field: keyof CountSchedule, value: string) => {
    setLocalSchedules(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const updateDevice = (id: number, field: keyof DeviceConfig, value: string) => {
    setLocalDevices(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sistem Ayarları</h1>
          <p className="text-slate-500">Sayım saatleri ve cihaz konfigürasyonları</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" />
          Değişiklikleri Kaydet
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('device')}
          className={clsx(
            "px-4 py-2 font-medium text-sm border-b-2 transition-colors flex items-center gap-2",
            activeTab === 'device' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
          )}
        >
          <Monitor className="w-4 h-4" />
          Cihaz & Entegrasyon
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={clsx(
            "px-4 py-2 font-medium text-sm border-b-2 transition-colors flex items-center gap-2",
            activeTab === 'schedule' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
          )}
        >
          <Clock className="w-4 h-4" />
          Sayım Saatleri
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Device Settings */}
        {activeTab === 'device' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-blue-800">ZKTeco SDK Entegrasyonu</h3>
                <p className="text-xs text-blue-600 mt-1">
                  Cihazların IP adreslerinin sistemle aynı ağda olduğundan emin olun (192.168.1.x). 
                  Bağlantı kurulduğunda "Otomatik İzleme" modu devreye girer ve okumalar anlık olarak sisteme düşer.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {settings.devices.map((device) => (
                <div key={device.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
                  {/* Status Indicator Bar */}
                  <div className={clsx(
                    "absolute top-0 left-0 w-1 h-full",
                    device.status === 'connected' ? "bg-green-500" : 
                    device.status === 'connecting' ? "bg-yellow-500" : 
                    device.status === 'error' ? "bg-red-500" : "bg-slate-300"
                  )} />

                  <div className="flex justify-between items-start mb-6 pl-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-800">{device.name}</h3>
                        <span className={clsx(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                          device.status === 'connected' ? "bg-green-100 text-green-700" : 
                          device.status === 'connecting' ? "bg-yellow-100 text-yellow-700" : 
                          device.status === 'error' ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-500"
                        )}>
                          {device.status === 'connected' ? 'Bağlı' : 
                           device.status === 'connecting' ? 'Bağlanıyor...' : 
                           device.status === 'error' ? 'Hata' : 'Bağlı Değil'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{device.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-mono">{device.ipAddress}:{device.port}</p>
                      {device.lastSync && (
                        <p className="text-[10px] text-slate-400 mt-1">
                          Son Sync: {format(new Date(device.lastSync), 'HH:mm')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Configuration Inputs */}
                  <div className="grid grid-cols-2 gap-4 mb-6 pl-2">
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">IP Adresi</label>
                      <input
                        type="text"
                        value={device.ipAddress}
                        onChange={(e) => updateDevice(device.id, 'ipAddress', e.target.value)}
                        disabled={device.status === 'connected'}
                        className="w-full px-3 py-2 text-sm border rounded bg-slate-50 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Port</label>
                      <input
                        type="number"
                        value={device.port}
                        onChange={(e) => updateDevice(device.id, 'port', e.target.value)}
                        disabled={device.status === 'connected'}
                        className="w-full px-3 py-2 text-sm border rounded bg-slate-50 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pl-2 border-t border-slate-100 pt-4">
                    {device.status !== 'connected' ? (
                      <button 
                        onClick={() => connectDevice(device.id)}
                        disabled={device.status === 'connecting'}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                      >
                        <Wifi className="w-4 h-4" />
                        {device.status === 'connecting' ? 'Bağlanıyor...' : 'Bağlan'}
                      </button>
                    ) : (
                      <button 
                        onClick={() => disconnectDevice(device.id)}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors border border-red-200"
                      >
                        <Power className="w-4 h-4" />
                        Bağlantıyı Kes
                      </button>
                    )}

                    <button 
                      onClick={() => syncDeviceData(device.id)}
                      disabled={device.status !== 'connected'}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors border border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Database className="w-4 h-4" />
                      Verileri Çek (Sync)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Schedule Settings */}
        {activeTab === 'schedule' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <Clock className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-800">Günlük Sayım Saatleri</h2>
            </div>
            
            <div className="space-y-4">
              {localSchedules.map((schedule) => (
                <div key={schedule.id} className="grid grid-cols-12 gap-4 items-center bg-slate-50 p-3 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors">
                  <div className="col-span-4">
                    <label className="text-xs text-slate-500 block mb-1">Sayım Adı</label>
                    <input
                      type="text"
                      value={schedule.name}
                      onChange={(e) => updateSchedule(schedule.id, 'name', e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="text-xs text-slate-500 block mb-1">Başlangıç</label>
                    <input
                      type="time"
                      value={schedule.startTime}
                      onChange={(e) => updateSchedule(schedule.id, 'startTime', e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="text-xs text-slate-500 block mb-1">Bitiş</label>
                    <input
                      type="time"
                      value={schedule.endTime}
                      onChange={(e) => updateSchedule(schedule.id, 'endTime', e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
