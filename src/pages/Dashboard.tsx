import React, { useEffect, useState } from 'react';
import { usePrison } from '../context/PrisonContext';
import RoomGrid from '../components/RoomGrid';
import { format, differenceInYears } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ScanFace, Fingerprint, Clock, AlertCircle, PlayCircle, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

const Dashboard = () => {
  const { activeCount, logs, inmates, simulateScan, resetLogs } = usePrison();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Son okunan 5 kişi
  const recentLogs = logs.slice(0, 5);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">Sistem Saati</p>
            <h2 className="text-2xl font-bold text-slate-800">
              {format(currentTime, 'HH:mm:ss')}
            </h2>
            <p className="text-xs text-slate-400 capitalize">
              {format(currentTime, 'dd MMMM yyyy, EEEE', { locale: tr })}
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className={clsx(
          "p-4 rounded-xl shadow-sm border flex items-center justify-between",
          activeCount ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200"
        )}>
          <div>
            <p className="text-sm text-slate-500 mb-1">Aktif Sayım</p>
            <h2 className={clsx("text-xl font-bold", activeCount ? "text-green-700" : "text-slate-700")}>
              {activeCount ? activeCount.name : 'Bekleniyor...'}
            </h2>
            {activeCount && (
              <p className="text-xs text-green-600">
                {activeCount.startTime} - {activeCount.endTime}
              </p>
            )}
          </div>
          <div className={clsx("p-3 rounded-lg", activeCount ? "bg-green-100" : "bg-slate-200")}>
            <AlertCircle className={clsx("w-6 h-6", activeCount ? "text-green-600" : "text-slate-500")} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">Toplam Okunan</p>
            <h2 className="text-2xl font-bold text-slate-800">{logs.length}</h2>
            <p className="text-xs text-slate-400">Bugünkü toplam işlem</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <ScanFace className="w-6 h-6 text-purple-600" />
          </div>
        </div>

        {/* Simulation Controls */}
        <div className="bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-700 flex flex-col justify-center gap-2">
          <div className="flex gap-2">
            <button 
              onClick={simulateScan}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <PlayCircle className="w-4 h-4" />
              Test Okuma
            </button>
            <button 
              onClick={resetLogs}
              className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors"
              title="Logları Temizle"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center">
            *Gerçek cihaz bağlı olmadığı için simülasyon kullanın
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Room Grid */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Oda Durumları</h3>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-slate-600">Tamamlandı</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-slate-600">Eksik Var</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                <span className="text-slate-600">Boş</span>
              </div>
            </div>
          </div>
          <RoomGrid />
        </div>

        {/* Right Side: Live Feed */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            Canlı Akış
          </h3>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {recentLogs.length === 0 ? (
              <div className="text-center text-slate-400 py-10">
                Henüz okuma yapılmadı.
              </div>
            ) : (
              recentLogs.map((log) => {
                const inmate = inmates.find(i => i.id === log.inmateId);
                if (!inmate) return null;
                const age = differenceInYears(new Date(), new Date(inmate.birthDate));

                return (
                  <div key={log.id} className="flex gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 animate-in slide-in-from-right duration-300">
                    <img 
                      src={inmate.photoUrl} 
                      alt="Inmate" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-800 text-sm truncate">
                          {inmate.firstName} {inmate.lastName}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {format(log.timestamp, 'HH:mm:ss')}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-2">
                        <span className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                          Oda: {inmate.roomNumber}
                        </span>
                        <span className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                          Yaş: {age}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 truncate">
                        Suç: {inmate.crime}
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center text-slate-400 border-l pl-2 border-slate-200">
                      {log.verificationType === 'face' ? (
                        <ScanFace className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Fingerprint className="w-4 h-4 text-purple-500" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
