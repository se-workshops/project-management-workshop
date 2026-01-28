import dataStore from '../store/dataStore.js';

export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'メールアドレスとパスワードを入力してください'
    });
  }

  const user = dataStore.findUserByEmail(email);

  if (!user || user.password !== password) {
    return res.status(401).json({
      success: false,
      error: 'メールアドレスまたはパスワードが正しくありません'
    });
  }

  const sessionId = dataStore.createSession(user.id);

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    },
    sessionId
  });
};

export const logout = (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const sessionId = authHeader.substring(7);
    dataStore.deleteSession(sessionId);
  }

  res.json({
    success: true,
    message: 'ログアウトしました'
  });
};

export const getCurrentUser = (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      address: req.user.address
    }
  });
};
