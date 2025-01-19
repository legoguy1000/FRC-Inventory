import { Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../sequelizeClient';

interface PartModel extends Model<InferAttributes<PartModel>, InferCreationAttributes<PartModel>> {
    // Some fields are optional when calling UserModel.create() or UserModel.build()
    id: CreationOptional<string>;
    name: string;
    location: string | null;
}

const Part = sequelize.define<PartModel>('part', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4

    },
    name: DataTypes.STRING,
    location: DataTypes.STRING,
});

export { Part, PartModel };
