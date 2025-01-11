import { Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../sequelizeClient';
import { Part } from './part';

interface ProjectModel extends Model<InferAttributes<ProjectModel>, InferCreationAttributes<ProjectModel>> {
    // Some fields are optional when calling UserModel.create() or UserModel.build()
    id: CreationOptional<string>;
    name: string;
}

const Project = sequelize.define<ProjectModel>('project', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4

    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
});


export { Project };
