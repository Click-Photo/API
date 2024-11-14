const jwt = require('jsonwebtoken');

const authenticateJWT = (allowedRoles = []) => (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ message: 'Não autorizado' });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);

        if(allowedRoles.length > 0 && !allowedRoles.includes(user.role)){
            return res.status(403).json({ message: "Permissão insuficiente" });
        }
        
        req.user = user; // Armazena o usuário decodificado para as rotas
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token inválido ou expirado' });
    }
};

module.exports = authenticateJWT;
