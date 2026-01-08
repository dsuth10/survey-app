import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SharingOptions({ user, sharing, setSharing }) {
  const [permissions, setPermissions] = useState(null);

  useEffect(() => {
    if (user && user.role === 'student' && user.classId) {
      // In a real app, we'd have an endpoint for this. For now, let's assume
      // the permissions are either fetched or we just check the user role.
      // Since we don't have the GET /api/classes/:id/permissions yet, 
      // let's assume students can share with class by default.
      setPermissions({
        canShareWithClass: true,
        canShareWithYearLevel: false, // Default restricted
        canShareWithSchool: false
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setSharing(prev => ({ ...prev, [name]: checked }));
  };

  const isTeacher = user?.role === 'teacher';

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', marginTop: '20px' }}>
      <h4>Distribution Options</h4>
      <div>
        <label>
          <input
            type="checkbox"
            name="sharedWithClass"
            checked={sharing.sharedWithClass}
            onChange={handleChange}
            disabled={!isTeacher && permissions && !permissions.canShareWithClass}
          />
          Share with Class
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="sharedWithYearLevel"
            checked={sharing.sharedWithYearLevel}
            onChange={handleChange}
            disabled={!isTeacher && permissions && !permissions.canShareWithYearLevel}
          />
          Share with Year Level
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="sharedWithSchool"
            checked={sharing.sharedWithSchool}
            onChange={handleChange}
            disabled={!isTeacher && permissions && !permissions.canShareWithSchool}
          />
          Share with School
        </label>
      </div>
      {!isTeacher && permissions && (
        <p style={{ fontSize: '0.8em', color: '#666' }}>
          Note: Some options may be restricted by your teacher.
        </p>
      )}
    </div>
  );
}
