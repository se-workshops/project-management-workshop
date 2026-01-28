import dataStore from '../store/dataStore.js';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: '認証が必要です'
    });
  }

  const sessionId = authHeader.substring(7); // Remove 'Bearer ' prefix
  const userId = dataStore.getUserIdBySession(sessionId);

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: 'セッションが無効または期限切れです'
    });
  }

  const user = dataStore.findUserById(userId);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'ユーザーが見つかりません'
    });
  }

  req.userId = userId;
  req.user = user;
  next();
};
