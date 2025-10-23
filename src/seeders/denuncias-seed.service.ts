import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    TypeComplaint,
    TypeComplaintsDocument,
} from '../complaints/schema/type-complaints.schema';

const denuncias: TypeComplaint[] = [
    {
        name: 'Accidente de Tránsito',
        description:
            'Es un suceso inesperado que ocurre en la vía pública y que involucra a vehículos, peatones u otros elementos relacionados con el tránsito. Este evento puede resultar en daños materiales, lesiones o incluso muertes.',
        image: '',
    },
    {
        name: 'Incendio',
        description:
            'Es una combustión no controlada que se propaga en un área determinada, causando daños materiales, ambientales y, en algunos casos, pérdidas humanas. Puede ser provocado por factores naturales o por causas humanas.',
        image: '',
    },
    {
        name: 'Personas en estado de ebriedad en vía pública',
        description:
            'Las personas en estado de ebriedad en vía pública pueden representar un riesgo tanto para su seguridad como para la de los demás. La intoxicación por alcohol puede afectar la coordinación, el juicio y la capacidad de reacción, lo que puede llevar a accidentes, alteraciones del orden público o incluso actos de violencia.',
        image: '',
    },
    {
        name: 'Persona Desaparecida',
        description:
            'La desaparición puede ser voluntaria o involuntaria y puede estar relacionada con diversas causas, como accidentes, desorientación, secuestros, conflictos familiares o situaciones de riesgo.',
        image: '',
    },
    {
        name: 'Riñas y peleas',
        description:
            'Son confrontaciones físicas o verbales entre dos o más personas, generalmente originadas por desacuerdos, provocaciones o conflictos personales. Pueden ocurrir en espacios públicos o privados y, en algunos casos, derivar en lesiones o daños materiales.',
        image: '',
    },
    {
        name: 'Robo',
        description:
            'Es un delito que consiste en la apropiación ilegítima de un bien ajeno mediante el uso de la fuerza, violencia o intimidación. Se diferencia del hurto, que ocurre sin el uso de violencia o amenazas.',
        image: '',
    },
    {
        name: 'Violencia',
        description:
            'Es el uso intencional de la fuerza física, verbal o psicológica para causar daño, intimidar o someter a otra persona. Puede manifestarse en distintos ámbitos, como el familiar, escolar, social o laboral, y adoptar diversas formas, como la violencia física, emocional, sexual o económica.',
        image: '',
    },
];

@Injectable()
export class DenunciasSeedService {
    constructor(
        @InjectModel(TypeComplaint.name)
        private readonly denunciasModel: Model<TypeComplaintsDocument>,
    ) { }

    async seed() {
        try {
            console.log('Running seed denuncias...');

            const count = await this.denunciasModel.countDocuments();
            if (count === 0) {
                await Promise.all(
                    denuncias.map((denuncia) =>
                        this.denunciasModel.create(denuncia),
                    ),
                );
                console.log('Seed complete denuncias ✅');
            } else {
                console.log('Denuncias already exist. Seed skipped.');
            }
        } catch (error) {
            console.error('Seed error denuncias:', error);
        }
    }
}
