import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { JwtDataAdministratorDto } from "src/dtos/administrator/jwt.data.administrator.dto";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from "config/jwt.secret";

@Injectable()
export class AuthMiddleware implements NestMiddleware{
    constructor(
        private readonly administratorService : AdministratorService
    ){}

    async use(req: Request, res: Response, next: NextFunction) {

       if(!req.headers.authorization){   //ako u request nemam autorizacioni token
        throw new HttpException('Token not found',HttpStatus.UNAUTHORIZED);
       }
       //dekodiram token sa jwt.verify() i ponovo dobijem json(19-27 red)
       const token = req.headers.authorization;
       const tokenParts = token.split(' '); // ovo radim zato sto se ispred tokena
       if(tokenParts.length !== 2){         // pojavljuje rec Bearer plus razmak
        throw new HttpException('Bad token',HttpStatus.UNAUTHORIZED);
       }
       const tokenString = tokenParts[1]; // ovo je drugi element u nizu - samo token

       const jwtData : JwtDataAdministratorDto = jwt.verify(tokenString,jwtSecret);

       if(!jwtData){ // ako deserijalizovanje nije proslo 
        throw new HttpException('Bad token found',HttpStatus.UNAUTHORIZED);
       }

       //ako je sve ok,i objekat jwtData postoji sad verifikujem podatke iz njega

       if(jwtData.ip !== req.ip.toString()){
        throw new HttpException('Bad token found',HttpStatus.UNAUTHORIZED);
       }
       if(jwtData.ua !== req.headers["user-agent"]){
        throw new HttpException('Bad token found',HttpStatus.UNAUTHORIZED);
       }
       const administrator = await this.administratorService.getById(jwtData.administratorId);
       if(!administrator){
        throw new HttpException('Account not found',HttpStatus.UNAUTHORIZED);
       }
       //proveravam da li je istekao token?
       const trenutniTimeStamp = new Date().getTime()/1000;
       if(trenutniTimeStamp >= jwtData.exp){
        throw new HttpException('The token has expired',HttpStatus.UNAUTHORIZED);
       }
       // ako nista od ovoga nije razlog za prekid, onda se poziva funkcija next()
       
       next();


    }
}