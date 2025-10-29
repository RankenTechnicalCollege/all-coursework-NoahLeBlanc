//|====================================================================================================|
//|-------------------------------------------[ IMPORTS ]----------------------------------------------|
//|====================================================================================================|
import {auth} from "../auth.js";
//|====================================================================================================|
//|-------------------------------------------[ FUNCTIONS ]--------------------------------------------|
//|====================================================================================================|
//|==================================================|
//|--------------------[-FETCH-SESSION-]-------------|
//|==================================================|
export async function fetchSession(req) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session) {
            throw new Error("No session found");
        }
        return session;
    } catch (err) {
        throw new Error("Invalid or expired session");
    }
}
//|==================================================|
//|--------------------[-ATTACH-SESSION-]------------|
//|==================================================|
export async function attachSession(req, res, next) {
    try {
        if (!req.session) {
            const session = await fetchSession(req);
            req.user = session.user;
            req.role = session.role;
            req.session = session.session;
        }
        next();
    } catch (err) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: err.message
        });
    };
};
//|==================================================|
//|-----------------[-IS-AUTHENTICATED-]-------------|
//|==================================================|
export function isAuthenticated(req, res, next) {
    if (!req.session || !req.user) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'You must be logged in'
        });
    }
    next();
};
//|==================================================|
//|-----------------[-HAS-ANY-ROLE-]-----------------|
//|==================================================|
export async function hasAnyRole(req, res, next) {
    try{
        session = await fetchSession(req, res);
        req.role = session.role;
        req.session = session.session;
        next();
    }catch(err){
        return res.status(401).json({
            error : 'Unauthorized',
            message : 'Invalid or expired session'
        })};
};
//|==================================================|
//|-------------------[-HAS-ROLE-]-------------------|
//|==================================================|
export async function hasRole(req, res, next) {
    try{
        session = await fetchSession(req, res);
        req.user = session.user;
        req.session = session.session;
        next();
    }catch(err){
        return res.status(401).json({
            error : 'Unauthorized',
            message : 'Invalid or expired session'
        })};
};

//|==================================================|
//|-----------------[-HAS-PERMISSION-]---------------|
//|==================================================|
export async function hasPermission(req, res, next) {
    try{
        session = await fetchSession(req, res);
        req.user = session.user;
        req.session = session.session;
        next();
    }catch(err){
        return res.status(401).json({
            error : 'Unauthorized',
            message : 'Invalid or expired session'
        })};
};