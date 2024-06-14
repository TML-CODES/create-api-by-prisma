const { {name} } = require("@prisma/client");
const { Request, Response, NextFunction } = require("express");
const { UserData } = require("../types");
const { {name}Repository } = require("../models/repositories");

exports.create = async(req, res, next)=>{
    try {
        const data = req.body;
        const response = await {name}Repository.create(data);
        return res.status(201).send(response);
    } catch (error) {
        console.error(error);
        return next(error); 
    }
}


exports.delete{Name}(req, res, next)=>{
    const { id } = req.params;
    const response = await {name}Repository.delete(id);
    return res.status(201).send(response);
}

exports.get = async(req, res, next)=>{
    try {
        const userData = req.cookies.userData;
        const id = req.params?.id || userData.id;
        const response = await {name}Repository.get({id});
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

        const response = await {name}Repository.update(id, data);
        return res.status(200).json(response);
    } catch (error) {
        return next(error);
    }
}

exports.search = async (req, res, next)=>{
    try {
        const { orderBy, ...whereProps } = req.query;
        const response = await {name}Repository.search(whereProps, orderBy);
        return res.status(200).send(response);
    } catch (error) {
        return next(error);
    }
}