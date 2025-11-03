import { Controller, Get } from '@nestjs/common';
import { Administrator } from 'entities/administrator.entity';
import { AdministratorService } from './services/administrator/administrator.service';
import { UserService } from './services/user/user.service';
import { User } from 'entities/user.entity';

@Controller()
export class AppController {
  constructor(
    private administratorService: AdministratorService,
    private userService: UserService,
  ) {}

  @Get() // http://localhost:3000
  getIndex(): string {
    return 'Home page!';
  }

  @Get('api/administrator') // http://localhost:3000/api/administrator
  getAllAdmins(): Promise<Administrator[]> {
    return this.administratorService.getAll();
  }

  @Get('api/user')
  getAllUser(): Promise<User[]> {
    return this.userService.getAll();
  }
}
