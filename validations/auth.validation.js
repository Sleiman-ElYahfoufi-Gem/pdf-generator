import { z } from 'zod';

export const loginSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  secretKey: z.string().min(1, "Secret Key is required"),
  email: z.string().email("Invalid email format")
});

export const validateLogin = (req, res, next) => {
  const result = loginSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.issues.map(err => ({
        field: err.path[0],
        message: err.message
      }))
    });
  }
  
  next();
};