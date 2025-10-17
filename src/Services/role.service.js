import { Roles } from "../entities/Roles.js"

export const initializationRoles = async () => {
    const basicRoles = [{
        idRole: 1,
        roleSumary: "Usuario"
    },
    {
        idRole: 2,
        roleSumary: "Veterinario"
    },
    {
        idRole: 3,
        roleSumary: "Admin"
    }
]

    await Roles.bulkCreate(basicRoles, {
    ignoreDuplicates: true, 
    });
}


