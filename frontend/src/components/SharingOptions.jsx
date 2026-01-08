import React, { useState, useEffect } from 'react';
import { Checkbox, Chip } from "@heroui/react";

export default function SharingOptions({ user, sharing, setSharing }) {
  const [permissions, setPermissions] = useState(null);

  useEffect(() => {
    if (user && user.role === 'student' && user.classId) {
      setPermissions({
        canShareWithClass: true,
        canShareWithYearLevel: false, 
        canShareWithSchool: false
      });
    }
  }, [user]);

  const handleChange = (name, checked) => {
    setSharing(prev => ({ ...prev, [name]: checked }));
  };

  const isTeacher = user?.role === 'teacher';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-default-700">Distribution Options</h4>
        {!isTeacher && <Chip size="sm" variant="flat">Student Limits</Chip>}
      </div>
      
      <div className="flex flex-col gap-3">
        <Checkbox
          isSelected={sharing.sharedWithClass}
          onValueChange={(checked) => handleChange("sharedWithClass", checked)}
          isDisabled={!isTeacher && permissions && !permissions.canShareWithClass}
          color="primary"
        >
          Share with Class
        </Checkbox>
        
        <Checkbox
          isSelected={sharing.sharedWithYearLevel}
          onValueChange={(checked) => handleChange("sharedWithYearLevel", checked)}
          isDisabled={!isTeacher && permissions && !permissions.canShareWithYearLevel}
          color="primary"
        >
          Share with Year Level
        </Checkbox>
        
        <Checkbox
          isSelected={sharing.sharedWithSchool}
          onValueChange={(checked) => handleChange("sharedWithSchool", checked)}
          isDisabled={!isTeacher && permissions && !permissions.canShareWithSchool}
          color="primary"
        >
          Share with School
        </Checkbox>
      </div>

      {!isTeacher && permissions && (
        <p className="text-xs text-default-400 mt-2 italic">
          Note: Some options may be restricted by your teacher.
        </p>
      )}
    </div>
  );
}
