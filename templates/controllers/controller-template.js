const { replace_here } = require("@prisma/client");
const { Request, Response, NextFunction } = require("express");
const { UserData } = require("../types");
const { replace_hereRepository } = require("../models/repositories");

exports.create = async(req, res, next)=>{
    try {
        const data = req.body;
        const response = await replace_hereRepository.create(data);
        return res.status(201).send(response);
    } catch (error) {
        console.error(error);
        return next(error); 
    }
}


exports.deleteReplace_Here = async(req, res, next)=>{
    const { id } = req.params;
    const response = await replace_hereRepository.delete(id);
    return res.status(201).send(response);
}

exports.get = async(req, res, next)=>{
    try {
        const userData = req.cookies.userData;
        const id = req.params?.id || userData.id;
        const response = await replace_hereRepository.get({id});
        return res.status(200).json(response);
    } catch (error) {
        return next(error);
    }
}

exports.update = async (req, res, next)=>{
    try {
        const userData = req.cookies.userData;
        const data = req.body;
        const id = req.params?.id || userData.id;

        const response = await replace_hereRepository.update(id, data);
        return res.status(200).json(response);
    } catch (error) {
        return next(error);
    }
}

exports.search = async (req, res, next)=>{
    try {
        const { orderBy, ...whereProps } = req.query;
        const response = await replace_hereRepository.search(whereProps, orderBy);
        return res.status(200).send(response);
    } catch (error) {
        return next(error);
    }
}