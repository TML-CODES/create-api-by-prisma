import { Request, Response, NextFunction } from "express";
import { UserData } from "../types";
import { replace_hereRepository } from "../models/repositories";

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const data = req.body;
        const response = await replace_hereRepository.create(data);
        return res.status(201).send(response);
    } catch (error) {
        return next(error); 
    }
}

export async function deleteReplace_Here(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const response = await replace_hereRepository.deleteReplace_Here(id);
        return res.status(202).send(response);
    } catch (error) {
        return next(error);
    }
}

export async function get(req: Request, res: Response, next: NextFunction) {
    try {
        const userData: UserData = req.cookies.userData;
        const id = req.params?.id || userData.id;
        const response = await replace_hereRepository.get(id);
        return res.status(200).json(response);
    } catch (error) {
        return next(error);
    }
}

export async function update(req: Request, res: Response, next: NextFunction) {
    try {
        const userData: UserData = req.cookies.userData;
        const data = req.body;
        const id = req.params?.id || userData.id;

        const response = await replace_hereRepository.update(id, data);
        return res.status(200).json(response);
    } catch (error) {
        return next(error);
    }
}

export async function search(req: Request, res: Response, next: NextFunction) {
    try {
        const { where, orderBy, limit, skip, ...whereProps } = <any> req.query;
        const response = await replace_hereRepository.search(where || whereProps, orderBy, limit, skip);
        return res.status(200).send(response);
    } catch (error) {
        return next(error);
    }
}