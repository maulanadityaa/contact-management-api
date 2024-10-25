import { z, ZodType } from 'zod';

export class AddressValidation {
  static readonly CREATE: ZodType = z.object({
    contactId: z.string().min(1).max(255),
    street: z.string().min(1).max(255),
    city: z.string().min(1).max(255),
    province: z.string().min(1).max(255),
    country: z.string().min(1).max(255),
    postalCode: z.string().min(1).max(20),
  });

  static readonly GET: ZodType = z.object({
    contactId: z.string().min(1).max(255),
    addressId: z.string().min(1).max(255),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.string().min(1).max(255),
    contactId: z.string().min(1).max(255),
    street: z.string().min(1).max(255).optional(),
    city: z.string().min(1).max(255).optional(),
    province: z.string().min(1).max(255).optional(),
    country: z.string().min(1).max(255).optional(),
    postalCode: z.string().min(1).max(20).optional(),
  });

  static readonly DELETE: ZodType = z.object({
    contactId: z.string().min(1).max(255),
    addressId: z.string().min(1).max(255),
  });
}
