import React from 'react';
import { usePrison } from '../context/PrisonContext';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Download, Search } from 'lucide-react';
import clsx from 'clsx';

const Reports = () => {
  const { logs, inmates, settings } = usePrison();

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sayım Raporları</h1>
          <p className="text-slate-500">Geçmiş okuma kayıtları ve detaylar</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="İsim veya Oda No ara..." 
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <button className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-slate-700 transition-colors">
            <Download className="w-4 h-4" />
            Excel İndir
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Zaman</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Mahkum</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Oda No</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Cihaz</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Doğrulama</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Henüz kayıt bulunmamaktadır.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const inmate = inmates.find(i => i.id === log.inmateId);
                  const device = settings.devices.find(d => d.id.toString() === log.deviceId);
                  
                  if (!inmate) return null;

                  return (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 text-slate-600 font-mono">
                        {format(log.timestamp, 'dd.MM.yyyy HH:mm:ss')}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <img src={inmate.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                          <span className="font-medium text-slate-800">{inmate.firstName} {inmate.lastName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-slate-600">
                        <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">
                          Oda {inmate.roomNumber}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-600">
                        {device ? device.name : 'Bilinmeyen Cihaz'}
                        <div className="text-xs text-slate-400">{device?.ipAddress}</div>
                      </td>
                      <td className="px-6 py-3">
                        <span className={clsx(
                          "px-2 py-1 rounded-full text-xs font-medium capitalize",
                          log.verificationType === 'face' ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                        )}>
                          {log.verificationType === 'face' ? 'Yüz Tanıma' : 'Parmak İzi'}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-green-600 font-medium flex items-center gap-1 text-xs">
                          Başarılı
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
