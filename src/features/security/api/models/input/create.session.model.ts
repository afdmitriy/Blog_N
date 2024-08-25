export interface SessionCreateModel {
   userId: string
   expirationDate: Date
   ip?: string
   deviceName: string
}