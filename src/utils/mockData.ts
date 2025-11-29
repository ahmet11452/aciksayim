import { fakerTR as faker } from '@faker-js/faker';
import { Inmate, DeviceConfig, CountSchedule } from '../types';

export const generateInmates = (count: number): Inmate[] => {
  const inmates: Inmate[] = [];
  for (let i = 0; i < count; i++) {
    inmates.push({
      id: faker.string.uuid(),
      firstName: faker.person.firstName('male'),
      lastName: faker.person.lastName(),
      roomNumber: faker.number.int({ min: 1, max: 40 }),
      birthDate: faker.date.birthdate({ min: 18, max: 70, mode: 'age' }),
      crime: faker.helpers.arrayElement([
        'Hırsızlık', 'Dolandırıcılık', 'Yaralama', 'Trafik Suçu', 'Vergi Usulsüzlüğü', 'Kamu Malına Zarar'
      ]),
      photoUrl: faker.image.avatar(),
      biometricRegistered: faker.datatype.boolean(0.8), // %80 ihtimalle kaydı var
      zkUserId: faker.number.int({ min: 1000, max: 9999 }).toString()
    });
  }
  return inmates;
};

export const defaultSchedules: CountSchedule[] = [
  { id: 1, name: 'Sabah Sayımı', startTime: '07:00', endTime: '08:00' },
  { id: 2, name: 'Öğle Sayımı', startTime: '11:30', endTime: '12:30' },
  { id: 3, name: 'İkindi Sayımı', startTime: '16:30', endTime: '17:30' },
  { id: 4, name: 'Akşam Sayımı', startTime: '19:00', endTime: '20:00' },
  { id: 5, name: 'Gece Sayımı', startTime: '22:30', endTime: '23:30' },
];

export const defaultDevices: DeviceConfig[] = [
  { 
    id: 1, 
    name: 'Ana Giriş Turnike 1', 
    ipAddress: '192.168.1.10', 
    port: 4370,
    type: 'hybrid', 
    location: 'A Blok Giriş',
    status: 'disconnected'
  },
  { 
    id: 2, 
    name: 'Yemekhane Giriş', 
    ipAddress: '192.168.1.12', 
    port: 4370,
    type: 'face', 
    location: 'Yemekhane',
    status: 'disconnected'
  },
];
