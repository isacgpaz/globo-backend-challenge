import { SetMetadata } from "@nestjs/common"
import { AccessLevel } from "@prisma/client"

export const ROLES_KEY = 'role'
export const HasRole = (accessLevel: AccessLevel) => SetMetadata(ROLES_KEY, accessLevel)