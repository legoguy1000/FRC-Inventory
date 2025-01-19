import { Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../sequelizeClient';

interface InventoryModel extends Model<InferAttributes<InventoryModel>, InferCreationAttributes<InventoryModel>> {
    // Some fields are optional when calling UserModel.create() or UserModel.build()
    id: CreationOptional<string>;
    location: string | null;
    purchased: Date;
    retired: Date | null;
    status: string | null;
    notes: string | null;
    partId: string | null;
    projectId: string | null;
}

const Inventory = sequelize.define<InventoryModel>('inventory', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4

    },
    location: DataTypes.STRING,
    purchased: DataTypes.DATE,
    retired: DataTypes.DATE,
    notes: DataTypes.TEXT,
    status: DataTypes.STRING,
    partId: DataTypes.UUID,
    projectId: DataTypes.UUID
});

export { Inventory, InventoryModel };
