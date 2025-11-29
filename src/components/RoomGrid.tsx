import React, { useState } from 'react';
import { usePrison } from '../context/PrisonContext';
import clsx from 'clsx';
import { Users, CheckCircle2, XCircle } from 'lucide-react';
import { Inmate } from '../types';
import { differenceInYears } from 'date-fns';

const RoomDetailModal = ({ roomNumber, onClose }: { roomNumber: number; onClose: () => void }) => {
  const { getRoomStatus, logs } = usePrison();
  const status = getRoomStatus(roomNumber);

  const getScanStatus = (inmateId: string) => {
    const log = logs.find(l => l.inmateId === inmateId);
    return log ? { scanned: true, time: log.timestamp } : { scanned: false, time: null };
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Oda {roomNumber} Detayı</h2>
            <p className="text-slate-500">Toplam {status.total} Mahkum | {status.scanned} Okunan</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <XCircle className="w-6 h-6 text-slate-500" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {status.inmates.map((inmate) => {
            const scanInfo = getScanStatus(inmate.id);
            const age = differenceInYears(new Date(), new Date(inmate.birthDate));
            
            return (
              <div key={inmate.id} className={clsx(
                "flex items-start gap-4 p-4 rounded-lg border-l-4 shadow-sm",
                scanInfo.scanned ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"
              )}>
                <img 
                  src={inmate.photoUrl} 
                  alt={`${inmate.firstName} ${inmate.lastName}`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-800">{inmate.firstName} {inmate.lastName}</h3>
                    {scanInfo.scanned ? (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Okundu
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Bekleniyor
                      </span>
                    )}
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-slate-600">
                    <p><span className="font-medium text-slate-500">Yaş:</span> {age}</p>
                    <p><span className="font-medium text-slate-500">Suç:</span> {inmate.crime}</p>
                    {scanInfo.scanned && (
                      <p className="text-xs text-green-600 mt-2">
                        Okuma Saati: {scanInfo.time?.toLocaleTimeString('tr-TR')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const RoomGrid = () => {
  const { getRoomStatus } = usePrison();
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const rooms = Array.from({ length: 40 }, (_, i) => i + 1);

  return (
    <>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
        {rooms.map((roomNum) => {
          const status = getRoomStatus(roomNum);
          
          let bgColor = 'bg-slate-100 border-slate-200'; // Boş veya nötr
          let textColor = 'text-slate-500';

          if (status.total > 0) {
            if (status.isComplete) {
              bgColor = 'bg-green-100 border-green-300 hover:bg-green-200';
              textColor = 'text-green-700';
            } else {
              bgColor = 'bg-red-100 border-red-300 hover:bg-red-200'; // Eksik var
              textColor = 'text-red-700';
            }
          }

          return (
            <button
              key={roomNum}
              onClick={() => setSelectedRoom(roomNum)}
              className={clsx(
                'aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 transition-all hover:scale-105 hover:shadow-md cursor-pointer',
                bgColor
              )}
            >
              <span className={clsx("text-lg font-bold", textColor)}>{roomNum}</span>
              <div className="flex items-center gap-1 mt-1 text-xs font-medium text-slate-600">
                <Users className="w-3 h-3" />
                <span>{status.scanned}/{status.total}</span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedRoom && (
        <RoomDetailModal roomNumber={selectedRoom} onClose={() => setSelectedRoom(null)} />
      )}
    </>
  );
};

export default RoomGrid;
