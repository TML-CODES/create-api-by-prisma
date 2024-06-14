import { Request } from 'express';

export function booleanify (value: string): boolean {
    const truthy: string[] = [
        'true',
        'True',
        '1'
    ]

    return truthy.includes(String(value))
}

type WherePrisma = {
    [key: string]: any,
    AND?: any[],
    OR?: any[],
    NOT?: any[]
}

type OrderByPrisma = {
    [key: string]: 'asc' | 'desc'
}

export function buildSqlToPrismaClosures (orderBy?: string | any): {orderBy: OrderByPrisma}{
    let orderByObj: OrderByPrisma = undefined;

    if(orderBy){
        if(typeof orderBy === 'string'){
            const field: string = orderBy.split(' ')[0];
            const order = <'asc'|'desc'> orderBy.split(' ')[1].toLowerCase();
            orderByObj = (field && order) 
                ? { [field]: order } 
                : {}
            ;
        }else{
            orderByObj = orderBy;
        }
    }

    return {
        orderBy: orderByObj
    };
}