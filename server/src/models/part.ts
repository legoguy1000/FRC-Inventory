import { Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes, Op } from 'sequelize';
import { sequelize } from '../sequelizeClient';
import { Inventory, InventoryModel } from './inventory';

interface PartModel extends Model<InferAttributes<PartModel>, InferCreationAttributes<PartModel>> {
    // Some fields are optional when calling UserModel.create() or UserModel.build()
    id: CreationOptional<string>;
    name: string;
    location: string | null;
    total_number?: number;
    // available_number: number;
    inventories?: InventoryModel[];
    countInventories: () => number;
}

const Part = sequelize.define<PartModel>('part', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4

    },
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    total_number: {
        type: DataTypes.VIRTUAL(DataTypes.NUMBER),
        async get() {
            // const a = await this.countInventories();
            // console.log(a);
            const a = this.inventories?.length;
            console.log(a);
            return a;
        },
        set(value) {
            throw new Error('Do not try to set the `fullName` value!');
        },
    }
});

export { Part, PartModel };
