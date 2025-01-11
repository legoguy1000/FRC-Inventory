import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelizeClient';


interface UserModel extends Model {
    firstName: string;
    lastName: string;
    fullName: string;
}

const User = sequelize.define<UserModel>('user', {
    firstName: DataTypes.TEXT,
    lastName: DataTypes.TEXT,
    fullName: {
        type: DataTypes.VIRTUAL,
        get() {
            return `${this.firstName} ${this.lastName}`;
        },
        set(value) {
            throw new Error('Do not try to set the `fullName` value!');
        },
    },
});

export { User };
