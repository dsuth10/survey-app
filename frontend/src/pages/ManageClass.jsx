import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function ManageClass() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [permissions, setPermissions] = useState({
    canShareWithClass: 0,
    canShareWithYearLevel: 0,
    canShareWithSchool: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchPermissions(selectedClassId);
    }
  }, [selectedClassId]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/classes');
      setClasses(response.data);
      if (response.data.length > 0) {
        setSelectedClassId(response.data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async (classId) => {
    try {
      const response = await axios.get(`/api/classes/${classId}/permissions`);
      setPermissions({
        canShareWithClass: response.data.canShareWithClass,
        canShareWithYearLevel: response.data.canShareWithYearLevel,
        canShareWithSchool: response.data.canShareWithSchool
      });
    } catch (err) {
      console.error('Failed to fetch permissions');
    }
  };

  const handleToggle = (field) => {
    setPermissions(prev => ({
      ...prev,
      [field]: prev[field] ? 0 : 1
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await axios.put(`/api/classes/${selectedClassId}/permissions`, permissions);
      setMessage('Permissions updated successfully!');
    } catch (err) {
      setMessage('Failed to update permissions.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'teacher') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6">
        <p className="text-red-600 dark:text-red-400 font-medium">Access denied. Teachers only.</p>
      </div>
    );
  }

  const selectedClass = classes.find(c => String(c.id) === String(selectedClassId));

  return (
    <div className="max-w-2xl mx-auto py-8 px-6 space-y-6">
      <div>
        <Link to="/" className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-primary uppercase tracking-wider mb-3">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Manage Class Permissions</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Control what sharing options are available to students in your classes when they create surveys.
        </p>
      </div>

      {classes.length === 0 ? (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
          <span className="material-symbols-outlined text-amber-500 shrink-0 mt-0.5">warning</span>
          <p className="text-sm text-amber-800 dark:text-amber-200">
            You don't have any classes assigned to you. Contact an administrator if this is incorrect.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Class selector */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Class to Manage</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Permissions card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Permissions: {selectedClass?.name}
              </h3>
            </div>
            <div className="p-5 space-y-5">
              {[
                { key: 'canShareWithClass', label: 'Class', icon: 'group' },
                { key: 'canShareWithYearLevel', label: 'Year Level', icon: 'school' },
                { key: 'canShareWithSchool', label: 'School', icon: 'apartment' },
              ].map(({ key, label, icon }) => (
                <label key={key} className="flex items-center gap-4 cursor-pointer group">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={!!permissions[key]}
                    onClick={() => handleToggle(key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${!!permissions[key] ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${!!permissions[key] ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors">{icon}</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Allow students to share with their <strong>{label}</strong>
                    </span>
                  </div>
                </label>
              ))}

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full mt-4 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-sm">{saving ? 'hourglass_top' : 'save'}</span>
                {saving ? 'Saving...' : 'Save Permissions'}
              </button>

              {message && (
                <div className={`mt-3 p-3 rounded-lg text-sm font-medium text-center ${
                  message.includes('success')
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
