import { users } from "@prisma/client";

export type UserData = {
    id: string,
    name: string,
    email: string,
    role: string,
    isActive: boolean
}