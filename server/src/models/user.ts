import { Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../sequelizeClient';

interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
    // Some fields are optional when calling UserModel.create() or UserModel.build()
    id: CreationOptional<string>;
    firstName: string;
    lastName: string;
    fullName: string | null;
}

const User = sequelize.define<UserModel>('user', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4

    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    fullName: {
        type: DataTypes.VIRTUAL,
        get() {
            return `${this.getDataValue('firstName')} ${this.getDataValue('lastName')}`;
        },
        set(value) {
            throw new Error('Do not try to set the `fullName` value!');
        }
    },
});

export { User };
