import React, { useState } from 'react';
import { usePrison } from '../context/PrisonContext';
import { Plus, Search, Edit2, Trash2, X, User, Save, Fingerprint } from 'lucide-react';
import { Inmate } from '../types';
import { format } from 'date-fns';
import clsx from 'clsx';

const Inmates = () => {
  const { inmates, addInmate, updateInmate, deleteInmate } = usePrison();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Inmate>>({
    firstName: '',
    lastName: '',
    roomNumber: 1,
    birthDate: new Date(),
    crime: '',
    photoUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/150x150/png?text=Foto',
    biometricRegistered: false
  });

  const filteredInmates = inmates.filter(inmate => 
    inmate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inmate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inmate.roomNumber.toString().includes(searchTerm)
  );

  const handleOpenModal = (inmate?: Inmate) => {
    if (inmate) {
      setEditingId(inmate.id);
      setFormData({ ...inmate });
    } else {
      setEditingId(null);
      setFormData({
        firstName: '',
        lastName: '',
        roomNumber: 1,
        birthDate: new Date('1990-01-01'),
        crime: '',
        photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
        biometricRegistered: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) return;

    const dataToSave = {
      ...formData,
      birthDate: new Date(formData.birthDate || new Date()),
    } as Omit<Inmate, 'id'>;

    if (editingId) {
      updateInmate(editingId, dataToSave);
    } else {
      addInmate(dataToSave);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu mahkumu silmek istediğinize emin misiniz?')) {
      deleteInmate(id);
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mahkum Yönetimi</h1>
          <p className="text-slate-500">Mahkum kayıt, düzenleme ve silme işlemleri</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Mahkum Ekle
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="İsim, Soyisim veya Oda No ile ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Inmates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Fotoğraf</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Ad Soyad</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Oda No</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Cihaz ID</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Biyometrik</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Suç</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInmates.map((inmate) => (
                <tr key={inmate.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-3">
                    <img 
                      src={inmate.photoUrl} 
                      alt="" 
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                  </td>
                  <td className="px-6 py-3 font-medium text-slate-800">
                    {inmate.firstName} {inmate.lastName}
                  </td>
                  <td className="px-6 py-3">
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600">
                      Oda {inmate.roomNumber}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-mono text-slate-500">
                    {inmate.zkUserId || '-'}
                  </td>
                  <td className="px-6 py-3">
                    {inmate.biometricRegistered ? (
                      <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded w-fit">
                        <Fingerprint className="w-3 h-3" />
                        <span className="text-xs font-medium">Kayıtlı</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-slate-400 bg-slate-100 px-2 py-1 rounded w-fit">
                        <X className="w-3 h-3" />
                        <span className="text-xs font-medium">Yok</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-3 text-slate-600">
                    {inmate.crime}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(inmate)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(inmate.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredInmates.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            Kayıt bulunamadı.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? 'Mahkum Düzenle' : 'Yeni Mahkum Ekle'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ad</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Soyad</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Oda Numarası (1-40)</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    required
                    value={formData.roomNumber}
                    onChange={e => setFormData({...formData, roomNumber: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">ZKTeco User ID</label>
                  <input
                    type="text"
                    placeholder="Cihazdaki ID"
                    value={formData.zkUserId || ''}
                    onChange={e => setFormData({...formData, zkUserId: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Suç</label>
                <input
                  type="text"
                  required
                  value={formData.crime}
                  onChange={e => setFormData({...formData, crime: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="biometric"
                  checked={formData.biometricRegistered}
                  onChange={e => setFormData({...formData, biometricRegistered: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="biometric" className="text-sm text-slate-700">
                  Biyometrik verisi (Yüz/Parmak) cihazda kayıtlı
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inmates;
