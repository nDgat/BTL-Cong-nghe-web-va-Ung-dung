const { AuditLog } = require('../models');

const createAuditLog = async ({ userId, userName, action, entity, entityId, oldValues, newValues, req, description }) => {
  try {
    await AuditLog.create({
      user_id: userId,
      user_name: userName,
      action,
      entity,
      entity_id: entityId,
      old_values: oldValues,
      new_values: newValues,
      ip_address: req ? (req.ip || req.connection?.remoteAddress) : null,
      user_agent: req ? req.get('User-Agent') : null,
      description,
    });
  } catch (error) {
    console.error('Audit log error:', error.message);
  }
};

// Middleware to auto-audit
const auditMiddleware = (action, entity) => {
  return (req, res, next) => {
    // Store original json method
    const originalJson = res.json.bind(res);
    
    res.json = function (data) {
      // Only audit successful operations
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const userId = req.user ? req.user.id : null;
        const userName = req.user ? req.user.full_name : 'System';
        
        createAuditLog({
          userId,
          userName,
          action,
          entity,
          entityId: data?.data?.id || req.params?.id,
          oldValues: req._auditOldValues || null,
          newValues: req.body || null,
          req,
          description: `${userName} performed ${action} on ${entity}`,
        });
      }
      
      return originalJson(data);
    };
    
    next();
  };
};

module.exports = { createAuditLog, auditMiddleware };
