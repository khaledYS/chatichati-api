import {Express, Request, Response} from "express" 
import { Db } from "mongodb";
export interface profile{
    _id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    phone: string;
    jwt?: string;
}

export type findOneProfileResult = profile | null;

export interface expressDb extends Express{
	db?: Db
}
export interface RequestDb extends Request{
	app:expressDb
}
