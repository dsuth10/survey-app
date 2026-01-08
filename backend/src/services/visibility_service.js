const db = require('../db/connection');

/**
 * Returns a list of survey IDs visible to a specific user based on their role and class.
 * Visibility rules:
 * - Teachers see all surveys.
 * - Students see surveys they created.
 * - Students see surveys shared with their Class (sharedWithClass=1).
 * - Students see surveys shared with their Year Level (sharedWithYearLevel=1).
 * - Students see surveys shared with the whole School (sharedWithSchool=1).
 */
function getVisibleSurveys(user) {
  if (user.role === 'teacher') {
    return db.prepare(`
      SELECT s.*, u.displayName as creatorName 
      FROM surveys s
      JOIN users u ON s.creatorId = u.id
      ORDER BY s.createdAt DESC
    `).all();
  }

  // Simplified logic for students:
  // 1. Their own surveys
  // 2. School-wide surveys
  // 3. Class-wide surveys (if they match the creator's class)
  // 4. Year-wide surveys (if they match the creator's year level)
  
  return db.prepare(`
    SELECT s.*, u.displayName as creatorName
    FROM surveys s
    JOIN users u ON s.creatorId = u.id
    WHERE s.creatorId = ? 
       OR s.sharedWithSchool = 1
       OR (s.sharedWithClass = 1 AND u.classId = ? AND u.classId IS NOT NULL)
       OR (s.sharedWithYearLevel = 1 AND u.yearLevel = ? AND u.yearLevel IS NOT NULL)
    ORDER BY s.createdAt DESC
  `).all(user.id, user.classId, user.yearLevel);
}

module.exports = { getVisibleSurveys };
