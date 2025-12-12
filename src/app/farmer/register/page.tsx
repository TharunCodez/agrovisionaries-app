'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, PlusCircle, Trash2, Tractor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { registerFarmerAction } from '@/app/actions/register-farmer';
import { useRole } from '@/contexts/role-context';
import Link from 'next/link';

const soilTypes = [
  "Alluvial",
  "Black Soil",
  "Red Soil",
  "Laterite",
  "Desert / Arid",
  "Mountain / Forest Soil",
  "Peaty / Marshy",
  "Saline / Alkaline",
  "Clay",
  "Sandy Loam",
  "Silty Loam",
] as const;

const plotSchema = z.object({
    surveyNumber: z.string().nonempty({ message: "Survey number is required." }),
    areaAcres: z.coerce.number().positive({ message: "Area must be a positive number." }),
    landType: z.enum(['Irrigated', 'Unirrigated'], { required_error: "Land type is required." }),
    soilType: z.enum(soilTypes, { required_error: "Soil type is required." }),
});


const formSchema = z.object({
  name: z.string().min(2, { message: 'Farmer name must be at least 2 characters.' }),
  phone: z.string().regex(/^\+?(91|977)\d{9,10}$/, { message: 'Please enter a valid Indian (+91) or Nepalese (+977) number with country code.' }),
  aadhaar: z.string().regex(/^\d{12}$/, { message: "Aadhaar number must be 12 digits."}),
  address: z.string().nonempty({ message: "Address is required." }),
  village: z.string().nonempty({ message: "Village is required." }),
  district: z.string().nonempty({ message: "District is required." }),
  plots: z.array(plotSchema).min(1, { message: "At least one plot is required." }),
});

export default function FarmerSelfRegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { setRole, setUser } = useRole();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      aadhaar: '',
      address: '',
      village: 'Jorethang',
      district: 'South Sikkim',
      plots: [{ surveyNumber: '', areaAcres: 0, landType: 'Irrigated', soilType: 'Alluvial' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "plots",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const { id } = await registerFarmerAction(values);
      toast({
        title: 'Registration Successful!',
        description: `Welcome, ${values.name}! You can now log in.`,
      });

      // Automatically log the user in
      const user = { uid: id, phoneNumber: values.phone, role: 'farmer' as const };
      setUser(user);
      setRole('farmer');
      router.replace('/farmer/dashboard');

    } catch (error) {
      console.error("Failed to register farmer: ", error);
      toast({
        variant: "destructive",
        title: 'Registration Failed',
        description: (error as Error).message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4">
                <img src="/AgroVisionaries_Green.png" alt="Agro Visionaries Logo" className="h-20 w-20 rounded-full object-cover border-2 border-primary shadow-md" />
            </div>
            <CardTitle className="text-3xl">Farmer Registration</CardTitle>
            <CardDescription>Create your account to get started with Agro Visionaries.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-primary">Personal Information</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g., Alex Doe" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input placeholder="+91 98765 43210" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="aadhaar" render={({ field }) => (
                    <FormItem><FormLabel>Aadhaar Number</FormLabel><FormControl><Input placeholder="xxxxxxxxxxxx" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>Full Address</FormLabel><FormControl><Textarea placeholder="House No, Street, Landmark..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="village" render={({ field }) => (
                        <FormItem><FormLabel>Village</FormLabel><FormControl><Input placeholder="e.g., Jorethang" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="district" render={({ field }) => (
                        <FormItem><FormLabel>District</FormLabel><FormControl><Input placeholder="e.g., South Sikkim" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
              </div>

              <Separator />

              {/* Land Plots Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-primary flex items-center gap-2"><Tractor /> Land Plot Information</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ surveyNumber: '', areaAcres: 0, landType: 'Irrigated', soilType: 'Alluvial' })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Plot
                    </Button>
                </div>

                {fields.map((field, index) => (
                    <div key={field.id} className="relative rounded-lg border bg-background p-4 pl-12">
                        <span className="absolute left-4 top-4 font-bold text-primary">{index + 1}</span>
                         <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 h-7 w-7"
                            onClick={() => remove(index)}
                            disabled={fields.length <= 1}
                        >
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                             <FormField control={form.control} name={`plots.${index}.surveyNumber`} render={({ field }) => (
                                <FormItem><FormLabel>Survey Number</FormLabel><FormControl><Input placeholder="e.g., 123/4A" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name={`plots.${index}.areaAcres`} render={({ field }) => (
                                <FormItem><FormLabel>Area (in acres)</FormLabel><FormControl><Input type="number" step="0.1" placeholder="e.g., 5.5" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name={`plots.${index}.landType`} render={({ field }) => (
                                <FormItem><FormLabel>Type of Land</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select land type" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Irrigated">Irrigated</SelectItem>
                                        <SelectItem value="Unirrigated">Unirrigated</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )} />
                              <FormField control={form.control} name={`plots.${index}.soilType`} render={({ field }) => (
                                <FormItem><FormLabel>Soil Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select soil type" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {soilTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </div>
                ))}
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Register and Login
              </Button>

               <div className="mt-4 text-center text-sm">
                  Already have an account?{' '}
                  <Link href="/login" className="font-medium text-primary underline">
                    Login here
                  </Link>
                </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
