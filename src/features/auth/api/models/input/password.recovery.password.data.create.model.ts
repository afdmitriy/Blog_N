export interface PasswordResetDataCreateModel {
   userId: string
   recoveryCode: string
   expirationDate: Date
}