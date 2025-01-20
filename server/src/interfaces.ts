interface Part {
    id: string;
    vendor: string;
    name: string;
    location: string | undefined;
    image_url: string | undefined;
    website: string | undefined;
    inventory?: Inventory[];
    createdAt: Date;
    updatedAt: Date;
    _count?: {
        inventory?: number;
        id?: number;
    }
}

interface Inventory {
    id: string;
    purchased: Date;
    retired: Date | undefined;
    notes: string | undefined;
    status: string | undefined;
    partId: string;
    part: Part;
    projectId: string | undefined;
    project?: Project;
    createdAt: Date;
    updatedAt: Date;
}
interface Project {
    id: string;
    name: string;
    owner?: string;
    retired: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count?: {
        inventory?: number;
    }
}

export { Project, Inventory, Part }
