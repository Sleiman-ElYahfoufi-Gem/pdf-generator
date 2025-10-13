import { z } from "zod";
//normal zod validation
export const pdfGenerationSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  email: z.string().email("Invalid email format"),
  country: z.string().min(2, "Country must be at least 2 characters").max(50),
  description: z.string().min(10, "Description must be at least 10 characters").max(500)
});

export const validatePDFGeneration = (req, res, next) => {
  const result = pdfGenerationSchema.safeParse(req.body);
  
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