import { Body, Controller, Post } from "@nestjs/common";
import { Crud, CrudController, CrudRequest, Override, ParsedRequest } from "@nestjsx/crud";
import { Article } from "entities/article.entity";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { ArticleService } from "src/services/article/article.service";

@Controller('api/article')
@Crud({
    model : {
        type : Article
    },
    params : {
        id : {
            field : 'articleId',
            type : 'number',
            primary : true
        }
    },
    query : {
        join : {
            category : {
                eager : true
            },
            photos : {
                eager : true
            },
            articlePrices : {
                eager : true
            },
            articleFeatures : {
                eager : true
            },
            features : {
                eager : true
            }
        }
    }
})
export class ArticleController implements CrudController<Article>{
    constructor(public service : ArticleService){}

    get base() : CrudController<Article>{
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

    @Post("createFull") // api/article/createFull
    createFullArticle(@Body()data: AddArticleDto){
        return this.service.createFullArticle(data);
    }
}