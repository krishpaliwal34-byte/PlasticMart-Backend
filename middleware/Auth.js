import express from 'express';
import jwt from 'jsonwebtoken';
const SECRET = 'superkey';

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ msg: "No Token" });
    }

    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ msg: "Invalid or expired token" });
    }
};

export default auth;