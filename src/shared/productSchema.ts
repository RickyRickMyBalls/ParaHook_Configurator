import { z } from 'zod'

export const productSchema = z.enum(['foothook', 'footpad', 'rail'])

export type ProductId = z.infer<typeof productSchema>
