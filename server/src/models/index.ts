import { User } from "./user";
import { Project } from "./project";
import { Part } from "./part";
import { sequelize } from "../sequelizeClient";

Project.hasMany(Part);
Part.belongsTo(Project);

sequelize.sync({ force: true });

export { User, Project, Part }
