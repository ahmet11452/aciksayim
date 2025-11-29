import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Inmate, ScanLog, AppSettings, CountSchedule, DeviceConfig } from '../types';
import { generateInmates, defaultSchedules, defaultDevices } from '../utils/mockData';
import { format } from 'date-fns';
import { ZKTecoMockService } from '../services/ZKTecoService';

interface PrisonContextType {
  inmates: Inmate[];
  logs: ScanLog[];
  settings: AppSettings;
  activeCount: CountSchedule | null;
  updateSettings: (newSettings: AppSettings) => void;
  simulateScan: () => void;
  resetLogs: () => void;
  getRoomStatus: (roomNumber: number) => { total: number; scanned: number; isComplete: boolean; inmates: Inmate[] };
  addInmate: (inmate: Omit<Inmate, 'id'>) => void;
  updateInmate: (id: string, data: Partial<Inmate>) => void;
  deleteInmate: (id: string) => void;
  // Device Actions
  connectDevice: (deviceId: number) => Promise<void>;
  disconnectDevice: (deviceId: number) => Promise<void>;
  syncDeviceData: (deviceId: number) => Promise<void>;
}

const PrisonContext = createContext<PrisonContextType | undefined>(undefined);

export const PrisonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [inmates, setInmates] = useState<Inmate[]>(() => generateInmates(200));
  const [logs, setLogs] = useState<ScanLog[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    schedules: defaultSchedules,
    devices: defaultDevices,
  });
  const [activeCount, setActiveCount] = useState<CountSchedule | null>(null);
  
  // Aktif servis instanceları
  const [deviceServices, setDeviceServices] = useState<{[key: number]: ZKTecoMockService}>({});

  useEffect(() => {
    const checkActiveCount = () => {
      const now = new Date();
      const currentTimeString = format(now, 'HH:mm');
      
      const active = settings.schedules.find(schedule => {
        return currentTimeString >= schedule.startTime && currentTimeString <= schedule.endTime;
      });
      
      setActiveCount(active || null);
    };

    const interval = setInterval(checkActiveCount, 10000);
    checkActiveCount();
    return () => clearInterval(interval);
  }, [settings.schedules]);

  // Cihazdan gelen gerçek zamanlı logu işle
  const handleRealTimeLog = (deviceId: string, logData: any) => {
    // Rastgele bir inmate seç (Simülasyon için, gerçekte logData.userId ile eşleşir)
    const inmate = inmates[Math.floor(Math.random() * inmates.length)];
    
    if (inmate) {
      const newLog: ScanLog = {
        id: Math.random().toString(36).substr(2, 9),
        inmateId: inmate.id,
        deviceId: deviceId,
        timestamp: new Date(),
        status: 'success',
        verificationType: logData.verifyMode === 15 ? 'face' : 'fingerprint',
      };
      
      // Ses efekti çalınabilir
      setLogs(prev => [newLog, ...prev]);
    }
  };

  const connectDevice = async (deviceId: number) => {
    const device = settings.devices.find(d => d.id === deviceId);
    if (!device) return;

    // UI Update: Connecting
    updateDeviceStatus(deviceId, 'connecting');

    try {
      const service = new ZKTecoMockService(device.ipAddress, device.port);
      await service.connect();

      // Listener ekle
      service.on('attLog', (data) => handleRealTimeLog(deviceId.toString(), data));

      setDeviceServices(prev => ({ ...prev, [deviceId]: service }));
      updateDeviceStatus(deviceId, 'connected');
    } catch (error) {
      console.error(error);
      updateDeviceStatus(deviceId, 'error');
      alert(`Cihaz bağlantı hatası: ${device.ipAddress}`);
    }
  };

  const disconnectDevice = async (deviceId: number) => {
    const service = deviceServices[deviceId];
    if (service) {
      await service.disconnect();
      const newServices = { ...deviceServices };
      delete newServices[deviceId];
      setDeviceServices(newServices);
    }
    updateDeviceStatus(deviceId, 'disconnected');
  };

  const syncDeviceData = async (deviceId: number) => {
    const service = deviceServices[deviceId];
    if (!service) {
      alert('Önce cihaza bağlanmalısınız!');
      return;
    }

    try {
      const deviceUsers = await service.getUsers();
      // Burada gelen kullanıcıları mevcut veritabanı ile eşleştirme mantığı olur
      alert(`${deviceUsers.length} kullanıcı cihazdan başarıyla çekildi ve senkronize edildi.`);
      
      // Son sync zamanını güncelle
      setSettings(prev => ({
        ...prev,
        devices: prev.devices.map(d => d.id === deviceId ? { ...d, lastSync: new Date() } : d)
      }));
    } catch (error) {
      alert('Veri çekme hatası');
    }
  };

  const updateDeviceStatus = (id: number, status: DeviceConfig['status']) => {
    setSettings(prev => ({
      ...prev,
      devices: prev.devices.map(d => d.id === id ? { ...d, status } : d)
    }));
  };

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  const simulateScan = () => {
    if (inmates.length === 0) return;
    
    const randomInmate = inmates[Math.floor(Math.random() * inmates.length)];
    const randomDevice = settings.devices[Math.floor(Math.random() * settings.devices.length)];
    
    const alreadyScanned = logs.some(log => 
      log.inmateId === randomInmate.id && 
      (new Date().getTime() - log.timestamp.getTime()) < 60 * 60 * 1000
    );

    if (!alreadyScanned) {
      const newLog: ScanLog = {
        id: Math.random().toString(36).substr(2, 9),
        inmateId: randomInmate.id,
        deviceId: randomDevice.id.toString(),
        timestamp: new Date(),
        status: 'success',
        verificationType: Math.random() > 0.5 ? 'face' : 'fingerprint',
      };
      setLogs(prev => [newLog, ...prev]);
    }
  };

  const resetLogs = () => {
    setLogs([]);
  };

  const getRoomStatus = (roomNumber: number) => {
    const roomInmates = inmates.filter(i => i.roomNumber === roomNumber);
    const scannedCount = roomInmates.filter(inmate => 
      logs.some(log => log.inmateId === inmate.id)
    ).length;

    return {
      total: roomInmates.length,
      scanned: scannedCount,
      isComplete: roomInmates.length > 0 && roomInmates.length === scannedCount,
      inmates: roomInmates
    };
  };

  const addInmate = (inmateData: Omit<Inmate, 'id'>) => {
    const newInmate: Inmate = {
      ...inmateData,
      id: Math.random().toString(36).substr(2, 9),
      biometricRegistered: false
    };
    setInmates(prev => [newInmate, ...prev]);
  };

  const updateInmate = (id: string, data: Partial<Inmate>) => {
    setInmates(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
  };

  const deleteInmate = (id: string) => {
    setInmates(prev => prev.filter(item => item.id !== id));
    setLogs(prev => prev.filter(log => log.inmateId !== id));
  };

  return (
    <PrisonContext.Provider value={{ 
      inmates, 
      logs, 
      settings, 
      activeCount, 
      updateSettings, 
      simulateScan, 
      resetLogs, 
      getRoomStatus,
      addInmate,
      updateInmate,
      deleteInmate,
      connectDevice,
      disconnectDevice,
      syncDeviceData
    }}>
      {children}
    </PrisonContext.Provider>
  );
};

export const usePrison = () => {
  const context = useContext(PrisonContext);
  if (context === undefined) {
    throw new Error('usePrison must be used within a PrisonProvider');
  }
  return context;
};
