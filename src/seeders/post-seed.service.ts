import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Post, PostDocument } from "src/users/schema/post.schema";

const posts: Post[] = [
    { name:'COMANDANTE' },
    { name:'SUB COMANDANTE' },
    { name:'OPERADOR' },
    { name:'PATRULLERO' },
    { name:'CONDUCTOR' },
    { name:'SECRETARIA' },
    { name:'MONITOREO DE CAMARAS' },
    { name:'DESPACHADOR' },
    { name:'RECEPCIONISTA' },

]

Injectable()
export class PostSeedService {
    constructor(@InjectModel(Post.name) private readonly postModel: Model<PostDocument>) {}

    async seed() {
        try {
            console.log('Running seed posts...');

            const count = await this.postModel.countDocuments();
            if (count === 0) {
                await Promise.all(
                    posts.map((post) =>
                        this.postModel.create(post),
                    ),
                );
                console.log('Seed complete posts ✅');
            } else {
                console.log('posts already exist. Seed skipped.');
            }
        } catch (error) {
            console.error('Seed error posts:', error);
        }
    }
}