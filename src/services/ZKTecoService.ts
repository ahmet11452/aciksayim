import { Inmate } from '../types';

// Bu servis, gerçek ZKTeco SDK'sının (zklib, node-zklib vb.) davranışını simüle eder.
// Gerçek bir uygulamada bu kodlar Node.js backend tarafında çalışır.

type EventCallback = (data: any) => void;

export class ZKTecoMockService {
  private ip: string;
  private port: number;
  private isConnected: boolean = false;
  private eventListeners: { [key: string]: EventCallback[] } = {};
  private simulationInterval: any = null;

  constructor(ip: string, port: number = 4370) {
    this.ip = ip;
    this.port = port;
  }

  // Event Listener Ekleme (Real-time loglar için)
  on(event: string, callback: EventCallback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  // Cihaza Bağlan
  async connect(): Promise<boolean> {
    console.log(`[ZKTeco SDK] Connecting to ${this.ip}:${this.port}...`);
    
    // Ağ gecikmesi simülasyonu
    await new Promise(resolve => setTimeout(resolve, 1500));

    // %90 başarı şansı
    if (Math.random() > 0.1) {
      this.isConnected = true;
      console.log(`[ZKTeco SDK] Connected successfully.`);
      this.startRealTimeMonitoring();
      return true;
    } else {
      console.error(`[ZKTeco SDK] Connection failed timeout.`);
      throw new Error('Cihaza erişilemiyor (Timeout)');
    }
  }

  // Bağlantıyı Kes
  async disconnect(): Promise<void> {
    this.isConnected = false;
    if (this.simulationInterval) clearInterval(this.simulationInterval);
    console.log(`[ZKTeco SDK] Disconnected.`);
  }

  // Cihazdan Kullanıcıları Çek
  async getUsers(): Promise<Partial<Inmate>[]> {
    if (!this.isConnected) throw new Error('Cihaz bağlı değil');

    console.log(`[ZKTeco SDK] Fetching users...`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Cihazdan gelen ham veriyi simüle et
    // Gerçekte: { uid: 1, userId: '1001', name: 'Ahmet', ... }
    return Array.from({ length: 5 }).map((_, i) => ({
      zkUserId: `100${i}`,
      firstName: 'Cihazdan',
      lastName: `Gelen ${i+1}`,
      biometricRegistered: true
    }));
  }

  // Canlı İzleme Modu (Real-time Logs)
  private startRealTimeMonitoring() {
    if (this.simulationInterval) clearInterval(this.simulationInterval);

    // Cihazdan rastgele anlık veri gelmesini simüle et
    this.simulationInterval = setInterval(() => {
      if (!this.isConnected) return;

      // %30 ihtimalle birisi parmak bastı
      if (Math.random() > 0.7) {
        const mockLog = {
          userId: Math.floor(Math.random() * 200).toString(), // Rastgele user ID
          verifyMode: Math.random() > 0.5 ? 1 : 15, // 1: Finger, 15: Face
          time: new Date()
        };
        
        this.emit('attLog', mockLog);
      }
    }, 3000);
  }

  private emit(event: string, data: any) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(cb => cb(data));
    }
  }
}
