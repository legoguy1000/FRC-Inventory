import { Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../sequelizeClient';
import { Project } from './project';

interface PartModel extends Model<InferAttributes<PartModel>, InferCreationAttributes<PartModel>> {
    // Some fields are optional when calling UserModel.create() or UserModel.build()
    id: CreationOptional<string>;
    name: string;
    location: string | null;
    purchased: Date;
    retired: Date | null;
    status: string | null;
    notes: string | null;
}

const Part = sequelize.define<PartModel>('Part', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4

    },
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    purchased: DataTypes.DATE,
    retired: DataTypes.DATE,
    notes: DataTypes.TEXT,
    status: DataTypes.STRING,
});

export { Part };
