'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { useTranslation } from 'react-i18next';
import '@/lib/i18n/client';


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
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: 'Please enter a valid phone number with country code.' }),
  aadhaar: z.string().regex(/^\d{12}$/, { message: "Aadhaar number must be 12 digits."}),
  address: z.string().nonempty({ message: "Address is required." }),
  village: z.string().nonempty({ message: "Village is required." }),
  district: z.string().nonempty({ message: "District is required." }),
  plots: z.array(plotSchema).min(1, { message: "At least one plot is required." }),
});

export default function RegisterFarmerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation("common");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      aadhaar: '',
      address: '',
      village: '',
      district: '',
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
      await registerFarmerAction(values);
      toast({
        title: t('gov.farmers.toast.addSuccessTitle'),
        description: t('gov.farmers.toast.addSuccessDesc', { farmerName: values.name }),
      });
      router.push('/government/farmers');
    } catch (error) {
      console.error("Failed to register farmer: ", error);
      toast({
        variant: "destructive",
        title: t('gov.farmers.toast.addErrorTitle'),
        description: (error as Error).message || t('gov.farmers.toast.addErrorDesc'),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-2xl md:text-3xl font-bold">{t('gov.farmers.register.title')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('gov.farmers.register.formTitle')}</CardTitle>
          <CardDescription>{t('gov.farmers.register.formDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-primary">{t('gov.farmers.register.personalInfo')}</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>{t('gov.farmers.register.fullName')}</FormLabel><FormControl><Input placeholder="e.g., Alex Doe" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>{t('gov.farmers.register.mobileNumber')}</FormLabel><FormControl><Input placeholder="+91 98765 43210" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="aadhaar" render={({ field }) => (
                    <FormItem><FormLabel>{t('aadhaar')}</FormLabel><FormControl><Input placeholder="xxxxxxxxxxxx" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>{t('address')}</FormLabel><FormControl><Textarea placeholder={t('gov.farmers.register.addressPlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="village" render={({ field }) => (
                        <FormItem><FormLabel>{t('gov.farmers.register.village')}</FormLabel><FormControl><Input placeholder="e.g., Rampur" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="district" render={({ field }) => (
                        <FormItem><FormLabel>{t('gov.farmers.register.district')}</FormLabel><FormControl><Input placeholder="e.g., Jaipur" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
              </div>

              <Separator />

              {/* Land Plots Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-primary flex items-center gap-2"><Tractor /> {t('landPlots')}</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ surveyNumber: '', areaAcres: 0, landType: 'Irrigated', soilType: 'Alluvial' })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> {t('gov.farmers.register.addPlot')}
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
                                <FormItem><FormLabel>{t('surveyNumber')}</FormLabel><FormControl><Input placeholder="e.g., 123/4A" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name={`plots.${index}.areaAcres`} render={({ field }) => (
                                <FormItem><FormLabel>{t('areaAcres')}</FormLabel><FormControl><Input type="number" step="0.1" placeholder="e.g., 5.5" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name={`plots.${index}.landType`} render={({ field }) => (
                                <FormItem><FormLabel>{t('landType')}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder={t('gov.farmers.register.selectLandType')} /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Irrigated">{t('irrigated')}</SelectItem>
                                        <SelectItem value="Unirrigated">{t('unirrigated')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )} />
                              <FormField control={form.control} name={`plots.${index}.soilType`} render={({ field }) => (
                                <FormItem><FormLabel>{t('soilType')}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder={t('gov.farmers.register.selectSoilType')} /></SelectTrigger></FormControl>
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
              
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('gov.farmers.registerFarmerButton')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
