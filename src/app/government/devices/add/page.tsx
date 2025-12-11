'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { addDeviceAction } from '@/app/actions/add-device';
import { useData } from '@/contexts/data-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';


const AddDeviceMap = dynamic(() => import('@/components/government/add-device-map'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

const formSchema = z.object({
  farmerId: z.string().nonempty({ message: 'You must select a farmer.' }),
  deviceId: z.string().nonempty({ message: 'Device ID is required.' }),
  nickname: z.string().nonempty({ message: 'Device nickname is required.' }),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  jalkundMaxQuantity: z.coerce.number().positive({ message: 'Jalkund quantity must be a positive number.' }),
  surveyNumber: z.string().nonempty({ message: 'You must select a plot.'}),
});

export default function AddDevicePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isMapOpen, setMapOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { farmers } = useData();
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);
  const { t } = useTranslation("common");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      farmerId: '',
      deviceId: '',
      nickname: '',
      lat: 27.1067, // Jorethang, South Sikkim
      lng: 88.3233, // Jorethang, South Sikkim
      jalkundMaxQuantity: 1000,
      surveyNumber: '',
    },
  });

  const selectedFarmer = farmers?.find(f => f.id === selectedFarmerId);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'farmerId') {
        setSelectedFarmerId(value.farmerId || null);
        form.reset({ ...value, surveyNumber: '' }); // Reset survey number when farmer changes
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    form.setValue('lat', lat);
    form.setValue('lng', lng);
    setMapOpen(false);
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    const farmer = farmers?.find(f => f.id === values.farmerId);
    if (!farmer) {
      toast({ variant: "destructive", title: 'Farmer not found' });
      setIsLoading(false);
      return;
    }
    
    const plot = farmer.plots.find(p => p.surveyNumber === values.surveyNumber);
    if (!plot) {
        toast({ variant: "destructive", title: 'Plot not found' });
        setIsLoading(false);
        return;
    }

    try {
      await addDeviceAction({
        deviceId: values.deviceId,
        nickname: values.nickname,
        farmerId: values.farmerId,
        location: { lat: values.lat, lng: values.lng },
        jalkundMaxQuantity: values.jalkundMaxQuantity,
        surveyNumber: values.surveyNumber,
        areaAcres: plot.areaAcres,
        landType: plot.landType,
        soilType: plot.soilType,
      });

      toast({
        title: t('gov.devices.toast.addSuccessTitle'),
        description: t('gov.devices.toast.addSuccessDesc', { deviceId: values.deviceId, farmerName: farmer.name }),
      });

      router.push('/government/devices');
    } catch (error) {
      console.error("Failed to add device: ", error);
      toast({
        variant: "destructive",
        title: t('gov.devices.toast.addErrorTitle'),
        description: (error as Error).message || t('gov.devices.toast.addErrorDesc'),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-2xl md:text-3xl font-bold">{t('gov.devices.add.title')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('gov.devices.add.formTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
              {/* Farmer Selection */}
              <FormField
                control={form.control}
                name="farmerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('gov.devices.add.selectFarmer')}</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('gov.devices.add.selectFarmerPlaceholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(farmers || []).map((farmer) => (
                            <SelectItem key={farmer.id} value={farmer.id}>
                                {farmer.name} ({farmer.phone})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Device ID and Nickname */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                    control={form.control}
                    name="deviceId"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('gov.devices.add.deviceId')}</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., AGRO-001" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="nickname"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('gov.devices.add.deviceNickname')}</FormLabel>
                        <FormControl>
                        <Input placeholder={t('gov.devices.add.deviceNicknamePlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

              {/* Plot Selection */}
               <FormField
                  control={form.control}
                  name="surveyNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('gov.devices.add.selectPlot')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedFarmer}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('gov.devices.add.selectPlotPlaceholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedFarmer?.plots.map((plot) => (
                            <SelectItem key={plot.surveyNumber} value={plot.surveyNumber}>
                              {t('gov.devices.add.surveyNo')}: {plot.surveyNumber} ({plot.areaAcres} {t('acres')})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />


              {/* Jalkund Max Quantity */}
                <FormField
                    control={form.control}
                    name="jalkundMaxQuantity"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('gov.devices.add.jalkundLabel')}</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="e.g., 5000" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              
              {/* Location Picker */}
              <div className="space-y-2">
                <FormLabel>{t('gov.devices.add.location')}</FormLabel>
                <div className='flex items-end gap-2'>
                    <div className='grid grid-cols-2 gap-2 flex-1'>
                         <FormField
                            control={form.control}
                            name="lat"
                            render={({ field }) => (
                            <FormItem>
                                <Label className="text-xs text-muted-foreground">{t('latitude')}</Label>
                                <FormControl>
                                <Input type="number" step="any" placeholder="e.g., 27.1067" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lng"
                            render={({ field }) => (
                            <FormItem>
                                <Label className="text-xs text-muted-foreground">{t('longitude')}</Label>
                                <FormControl>
                                <Input type="number" step="any" placeholder="e.g., 88.3233" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                     <Dialog open={isMapOpen} onOpenChange={setMapOpen}>
                        <DialogTrigger asChild>
                            <Button type="button" variant="outline">
                                <MapPin className="mr-2 h-4 w-4" /> {t('gov.devices.add.pickOnMap')}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="h-[70vh] max-w-[90vw] p-2 flex flex-col lg:max-w-[70vw]">
                            <DialogHeader className="p-4 flex-shrink-0">
                                <DialogTitle>{t('gov.devices.add.mapDialogTitle')}</DialogTitle>
                            </DialogHeader>
                            <div className="flex-grow w-full overflow-hidden rounded-lg">
                                {isMapOpen && <AddDeviceMap onLocationSelect={handleLocationSelect} />}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
              </div>


              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('gov.devices.add.submitButton')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
