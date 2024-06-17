import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Users from "../models/repositories/Users.repository";
import { verifyTokenFormat } from "../utils/helpers";
import NodeCache from "node-cache";
import sendEmail from "../modules/nodemailer";
import moment from "moment";
import fs from 'fs';
import path from "path";
import bcrypt from "bcrypt";
import { UserData } from "../types/index";
import nodemailer from "../modules/nodemailer";

const myCache = new NodeCache();

const HTML_EMAIL_AUTH_CODE = fs.readFileSync(
    path.resolve(__dirname, '../frontend/templates/emailAuthCode.template.html'), 
    { 'encoding': 'utf8' }
)
.toString();

const HTML_RESET_PASSWORD = 
fs.readFileSync(
    path.resolve(__dirname, '../frontend/templates/htmlResetPassword.html'), 
    { 'encoding': 'utf8' }
)
.toString();

const EMAIL_HTML_RESET_PASSWORD = 
fs.readFileSync(
    path.resolve(__dirname, '../frontend/templates/emailResetPasswordHtml.html'), 
    { 'encoding': 'utf8' }
)
.toString();

function generateAccessTokens(userData: UserData): { access_token: string, refresh_token: string, expires_in: number }{
    const expires_in = 5400;
    const access_token = jwt.sign(
        <UserData> {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            isActive: userData.isActive,
            role: userData.role
        }, 
        process.env.API_SECRET, 
        { expiresIn: expires_in } // 5400 = 1:30
    ); 
    const refresh_token = jwt.sign(
        { grant_type: 'refresh' }, 
        process.env.API_SECRET_REFRESH
    ); 

    return { access_token, refresh_token, expires_in }
} 

export async function sendLoginCode(req: Request, res: Response, next: NextFunction) {
    try{
        const { email } = req.body;
        if(!email || ['null', 'undefined'].includes(email)){
            return res.status(400).send();
        }
        
        if(!myCache.get(email)){
            myCache.set(email, 'true', 120);
        }else{
            return res.status(403).send({ 
                message: 'Esse email já solicitou um código. Tente novamente após 2 minutos.' 
            });
        }

        const user = await Users.get(
            { email }, 
            { 
                id: true,
                name: true,
                email: true,
                roleId: true
            }
        );
        if (!user) {
            throw { status: 404, message: "Usuário não cadastrado" };
        }
        
        let [user] = await Users.search({ userId: user.id }, undefined, { user: true });
        const code = Math.random().toString().slice(2,8);
        const expCode = moment().utc().add(5, 'minutes').toDate()
        
        if(user){
            user = <any> await Users.update(user.id, { code, expCode });
        }else{
            user = <any> await Users.create({
                id: undefined, 
                userId: user.id, 
                accessToken: undefined,
                refreshToken: undefined, 
                code,
                expCode,
                createdAt: moment().utc().toDate(),
                updatedAt: moment().utc().toDate()
            })
        }
        
        await sendEmail(email, 'Código de Autenticação de Login', HTML_EMAIL_AUTH_CODE.replace('{{code}}', code));
        return res.status(200).send({ message: 'E-mail enviado com sucesso!' });
    }catch (error){
        return next(error);
    }
}

export async function authenticateWithCode(req: Request, res: Response, next: NextFunction) {
    try {
        const { code, email } = req.body;
        if(!code || ['null', 'undefined'].includes(code)){
            return res.status(400).send();
        }

        const [user] = await Users.search({ code, email }, undefined, { user: true });
        if(!user){
            return res.status(401).send({ message: 'Código inválido' });
        }else if(moment(user.expCode) < moment().utc()){
            return res.status(401).send({ message: 'Código expirado' });
        }
    
        const expiresIn = 5400; // 5400 = 1:30
        const accessToken = jwt.sign(
            { 
                id: user.user.id,
                name: user.user.name,
                email: user.user.email,
                roleId: user.user.roleId
            },
            process.env.API_SECRET,
            { expiresIn } 
        );
    
        const refreshToken = jwt.sign({}, process.env.API_SECRET_REFRESH);
        await Users.update(user.id, { refreshToken, accessToken, code: null, expCode: null });

        return res.status(200).send({ 
            access_token: accessToken, 
            expires_in: expiresIn, 
            refresh_token: refreshToken 
        });
    } catch (err: any) {
        return next(err);
    }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
        const refreshToken = verifyTokenFormat(req);
        jwt.verify(refreshToken, process.env.API_SECRET_REFRESH);
        const [user] = await Users.search({ refreshToken }, undefined, { user: true });
        if(!user){
            return res.status(401).send({});
        }

        const expiresIn = 5400; // 5400 = 1:30
        const accessToken = jwt.sign(
            { 
                id: user.user.id,
                name: user.user.name,
                email: user.user.email,
                roleId: user.user.roleId
            },
            process.env.API_SECRET,
            { expiresIn } 
        );
    
        const newRefreshToken = jwt.sign({}, process.env.API_SECRET_REFRESH);
        await Users.update(user.id, { refreshToken: newRefreshToken, accessToken });
        
        return res.status(200).send({ 
            access_token: accessToken, 
            expires_in: expiresIn, 
            refresh_token: newRefreshToken 
        });
    } catch (error) {
        return next({ status: 401, message: "RefreshToken inválido" });
    }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
    try {
        const refreshToken = verifyTokenFormat(req);
        jwt.verify(refreshToken, process.env.API_SECRET_REFRESH);
        const [user] = await Users.search({ refreshToken }, undefined, { user: true });
        if(!user){
            return res.status(401).send({ message: 'RefreshToken inválido' });
        }

        await Users.update(user.id, { refreshToken: null });
        return res.status(200).send();
    } catch (error) {
        return next({ status: 401, message: "RefreshToken inválido" });
    }
}

export async function loginWithPassword(req: Request, res: Response, next: NextFunction){
    try{        
        let { email, password } = req.body;
        const [user] = await Users.list({ email });
        if(!user){
            return res.status(404).send({ message: 'Usuário não encontrado' });
        }else{
            const match = bcrypt.compareSync(password, user.password);
            if(!match){
                return res.status(409).send({ message: 'Senha inválida' })
            }
            if(!user.isActive){
                return res.status(403).send({ message: 'Usuário inativo' });
            }

            const tokens = generateAccessTokens(user);
            await Users.update(user.id, { refresh_token: tokens.refresh_token });
            return res.status(200).send(tokens);
        }
    }catch(err: any){
        return next(err);
    }
}

export async function sendPasswordResetEmail(req: Request, res: Response, next: NextFunction) {
    try {
        const { email } = req.body;
        if(!myCache.get(email)){
            myCache.set(email, 'true', 300 );
        }else{
            return res.status(400).send({ 
                message: 'Esse email já solicitou a recuperação de senha. Tente novamente após alguns minutos.' 
            });
        }

        console.log(process.env.EMAIL_SENDER)

        const [user] = await Users.list({ email });
        if(!user){
            return res.status(404).send({ message: 'Usuário não cadastrado' })
        }

        const resetToken = jwt.sign(
            { id: user.id }, 
            process.env.API_SECRET, 
            { expiresIn: 1800 } // 1800 = 30min
        ); 

        const resetPasswordLink = `${process.env.BASE_URL}/auth/reset-password?resetToken=${resetToken}`
    
        await nodemailer(
            email, 
            'Redefinição de senha', 
            EMAIL_HTML_RESET_PASSWORD.replace('{resetPasswordLink}', resetPasswordLink)
        );
    } catch (error) {
        console.error('Erro ao enviar e-mail de redefinição de senha:', error);
        return res.status(502).send({ message: error.message });
    }
}

export async function getHtmlResetPass(req: Request, res: Response, next: NextFunction){
    const {resetToken} = req.query;
    if(!resetToken){
        return res.status(400);
    }
    
    return res.status(200).send(HTML_RESET_PASSWORD.replace('{resetToken}', String(resetToken)));
}

export async function resetUserPassword(req: Request, res: Response, next: NextFunction){
    try{
        let { newPassword } = req.body;
        const { resetToken } = <any> req.params;
        const { id } = <{ id: string }> jwt.verify(resetToken, process.env.API_SECRET);
        newPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(12)),
        await Users.update(id, { password: newPassword });
        return res.status(200).sendFile(path.resolve(__dirname, '../frontend/views/templates/htmlSuccessResetPassword.html'));
    }catch(error){
        return next(error)
    }
}
