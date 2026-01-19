import { Controller } from "@nestjs/common";
import { Crud, CrudController, CrudRequest, CrudService, Override, ParsedRequest } from "@nestjsx/crud";
import { Feature } from "entities/feature.entity";
import { FeatureService } from "src/services/feature/feature.service";

@Controller('api/feature')
@Crud({
    model : {
        type : Feature
    },
    params : {
        id : {
            field : 'featureId',
            type : 'number',
            primary : true
        }
    },
    query : {
        join : {
            category : {
                eager : true
            },
            articles : {
                eager : true
            },
            articleFeatures : {
                eager : true
            }
        }
    }
})
export class FeatureController implements CrudController<Feature>{
    constructor(public service : FeatureService){}
    get base() : CrudController<Feature>{
            return this;
        }
        @Override()
        getMany(@ParsedRequest()req : CrudRequest){
            return this.base.getManyBase(req);
        }
        @Override('getOneBase')
        getOneAndDoStuff(
        @ParsedRequest() req: CrudRequest,
      ) {
        return this.base.getOneBase(req);
      }
}