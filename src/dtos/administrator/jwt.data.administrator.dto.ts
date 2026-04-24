export class JwtDataAdministratorDto{
    administratorId: number;
    username: string;
    exp: number; // unix timestamp-datum isteka tokena
    ip: string;
    ua: string; // user agent

    toPlainObject(){
        return{
           administratorId : this.administratorId,
           username : this.username,
           exp : this.exp,
           ip : this.ip,
           ua : this.ua
        }
    }
}