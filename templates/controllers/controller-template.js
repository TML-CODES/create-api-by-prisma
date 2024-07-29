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
        return next(error); 
    }
}


exports.deleteReplace_Here = async(req, res, next)=>{
    try{
        const { id } = req.params;
        const oldData = await replace_hereRepository.get(id);
        if(!oldData){
            return res.status(404).send({ message: 'Not found.' });
        }
        const response = await replace_hereRepository.deleteReplace_Here(id);
        return res.status(202).send(response);
    } catch (error) {
        return next(error); 
    }
}

exports.get = async(req, res, next)=>{
    try {
        const userData = req.cookies.userData;
        const id = req.params?.id || userData.id;
        const response = await replace_hereRepository.get(id);
        if(!response){
            return res.status(404).send({ message: 'Not found.' });
        }
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

        const oldData = await replace_hereRepository.get(id);
        if(!oldData){
            return res.status(404).send({ message: 'Not found.' });
        }
        
        const response = await replace_hereRepository.update(id, data);
        return res.status(200).json(response);
    } catch (error) {
        return next(error);
    }
}

exports.search = async (req, res, next)=>{
    try {
        const { where, orderBy, limit, skip, ...whereProps } = req.query;
        const response = await replace_hereRepository.search(where || whereProps, orderBy, limit, skip);
        return res.status(200).send(response);
    } catch (error) {
        return next(error);
    }
}