import {z} from 'zod';

const schema = z.object({
  firstName: z.string().min(1, "Last Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  // serviceName: z.string().min(1, "Service name is required"),
  // contactNumber: z.string().regex(/^\d{10,}$/, "Please enter a valid contact number"),
  // serviceRegistrationNumber: z.string().min(1, "Service registration number is required")
});

export default schema;