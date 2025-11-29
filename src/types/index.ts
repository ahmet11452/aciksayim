export interface Inmate {
  id: string;
  firstName: string;
  lastName: string;
  roomNumber: number;
  birthDate: Date;
  crime: string;
  photoUrl: string;
  biometricRegistered: boolean; // Yeni: Biyometrik kaydı var mı?
  zkUserId?: string; // Cihazdaki ID
}

export interface ScanLog {
  id: string;
  inmateId: string;
  deviceId: string;
  timestamp: Date;
  status: 'success' | 'failed';
  verificationType: 'face' | 'fingerprint';
}

export interface RoomStatus {
  roomNumber: number;
  totalInmates: number;
  scannedInmates: number;
  isComplete: boolean;
  inmates: Inmate[];
}

export interface CountSchedule {
  id: number;
  startTime: string; // "07:00"
  endTime: string;   // "08:00"
  name: string;      // "Sabah Sayımı"
}

export interface DeviceConfig {
  id: number;
  name: string;
  ipAddress: string;
  port: number;
  type: 'face' | 'fingerprint' | 'hybrid';
  location: string;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  lastSync?: Date;
}

export interface AppSettings {
  schedules: CountSchedule[];
  devices: DeviceConfig[];
}
