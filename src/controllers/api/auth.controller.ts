import { Body, Controller, Post, Req } from "@nestjs/common";
import { LoginAdministratorDto } from "src/dtos/administrator/login.administrator.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as crypto from 'crypto';
import { LoginInfoAdministratorDto } from "src/dtos/administrator/login.info.administrator.dto";
import * as jwt from 'jsonwebtoken'; 
import { JwtDataAdministratorDto } from "src/dtos/administrator/jwt.data.administrator.dto";
import { Request } from "express";
import { jwtSecret } from "config/jwt.secret";
import { resolve } from "path";

@Controller('auth')
export class AuthController {
constructor(
    public administratorService : AdministratorService
){}

@Post('login') //http://localhost:3000/auth/login/
    async doLogin(@Body()data : LoginAdministratorDto,@Req()req: Request)
       : Promise<LoginInfoAdministratorDto | ApiResponse> {
       const administrator = await this.administratorService.getByUsername(data.username);

       if(!administrator){ //ako se username ne poklapa (baza i dto)
        return new Promise(resolve => resolve(new ApiResponse('error',-3001)));
       }

        const passwordHash = crypto.createHash('sha512');
           passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        if(administrator.passwordHash !== passwordHashString){ //ako se password hash ne poklapa
        return new Promise(resolve => resolve(new ApiResponse('error',-3002)));
        }

        //ako se sve poklapa,onda ide vracanje info (sa pravljenjem tokena)

        const jwtData = new JwtDataAdministratorDto();
        jwtData.administratorId = administrator.administratorId;
        jwtData.username = administrator.username;
        let sada = new Date();// trenutno vreme
        sada.setDate(sada.getDate()+14);// setovan token da istekne za 14 dana
        const istekTimeStamp = sada.getTime()/1000;//delim sa 1000 jer je vracen rezultat u milisekundama
        jwtData.exp = istekTimeStamp;
        jwtData.ip = req.ip.toString();// upisan i drugi atribut u metodu ,@Req
        jwtData.ua = req.headers["user-agent"];

        let token : string = jwt.sign(jwtData.toPlainObject(),jwtSecret);// enkodiran token

        const responseObject = new LoginInfoAdministratorDto(
            administrator.administratorId,
            administrator.username,
            token
        ); 

        return new Promise(resolve => resolve(responseObject));
        
            


    }
}