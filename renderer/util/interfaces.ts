export interface PasswordData {
    label?: string
    value?: string
    username?: string | undefined
    email?: string | undefined
    website?: string | undefined
    notes?: string | undefined
    icon?: string | undefined
    edit?: {
        lastModified?: number
    }
}