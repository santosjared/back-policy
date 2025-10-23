import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Grade, GradeDocument } from "src/users/schema/grade.schema";

const grades: Grade[] = [
    { name:'CNL. MSc. CAD.' },
    { name:'TTE.' },
    { name:'SBTTE.' },
    { name:'SOF. 2DO' },
    { name:'SGTO. MY.' },
    { name:'SGTO. 1RO.' },
    { name:'SGTO. 2DO.' },
    { name:'SGTO.' },

]

Injectable()
export class GradeSeedService {
    constructor(@InjectModel(Grade.name) private readonly gradeModel:Model<GradeDocument>){}
    
    async seed(){
                try {
            console.log('Running seed grades...');

            const count = await this.gradeModel.countDocuments();
            if (count === 0) {
                await Promise.all(
                    grades.map((grade) =>
                        this.gradeModel.create(grade),
                    ),
                );
                console.log('Seed complete grades ✅');
            } else {
                console.log('grades already exist. Seed skipped.');
            }
        } catch (error) {
            console.error('Seed error grades:', error);
        }
    }
}