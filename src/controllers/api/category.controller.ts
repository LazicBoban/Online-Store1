import { Controller } from "@nestjs/common";
import { Crud, CrudController, CrudRequest, Override, ParsedRequest } from "@nestjsx/crud";
import { Category } from "entities/category.entity";
import { CategoryService } from "src/services/category/category.service";
@Controller('api/category')

@Crud({
    model : {
        type : Category,
    },
    params : {
        id : {
            field : 'categoryId',
            type : 'number',
            primary : true,
        },
    },
    query : {
      join : {
        categories : {
          eager : true
        },
        parentCategory : {
          eager : true
        },
        features : {
          eager : true
        },
        articles : {
          eager : true
        }
      }
    }
})

export class CategoryController implements CrudController<Category>{
 constructor(public service : CategoryService){}

   get base(): CrudController<Category > {
    return this;
  }

  @Override()
    getMany(@ParsedRequest() req: CrudRequest,){
    return this.base.getManyBase(req);
  }

   @Override('getOneBase')
        getOneAndDoStuff(
        @ParsedRequest() req: CrudRequest,
      ) {
        return this.base.getOneBase(req);
      }
}