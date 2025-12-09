'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/data-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';

const AddDeviceMap = dynamic(() => import('@/components/government/add-device-map'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

const formSchema = z.object({
  farmerName: z.string().nonempty({ message: 'Farmer name is required.' }),
  farmerPhone: z.string().nonempty({ message: 'Farmer phone number is required.' }),
  deviceId: z.string().nonempty({ message: 'Device ID is required.' }),
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  notes: z.string().optional(),
});

export default function AddDevicePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addDeviceAndFarmer, getNextDeviceId } = useData();
  const [isMapOpen, setMapOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const defaultDeviceId = useMemo(() => getNextDeviceId(), [getNextDeviceId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      farmerName: '',
      farmerPhone: '',
      deviceId: defaultDeviceId,
      lat: 28.6139,
      lng: 77.209,
      notes: '',
    },
  });

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    form.setValue('lat', lat);
    form.setValue('lng', lng);
    setMapOpen(false);
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newDevice = {
        id: values.deviceId,
        name: `Device ${values.deviceId}`, // Generic name
        location: `Lat: ${values.lat.toFixed(4)}, Lng: ${values.lng.toFixed(4)}`,
        lat: values.lat,
        lng: values.lng,
        notes: values.notes,
        farmerName: values.farmerName,
        farmerPhone: values.farmerPhone
    };

    addDeviceAndFarmer(newDevice, { name: values.farmerName, phone: values.farmerPhone });

    toast({
      title: 'Device Added Successfully!',
      description: `${newDevice.id} has been registered for ${values.farmerName}.`,
    });
    
    setIsLoading(false);
    router.push('/government/devices');
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-2xl md:text-3xl font-bold">Register New Device</h1>
      <Card>
        <CardHeader>
          <CardTitle>Device Registration Form</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="farmerName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Farmer Name</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Ravi Kumar" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="farmerPhone"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Farmer Phone Number</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., +919876543210" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

              <FormField
                control={form.control}
                name="deviceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., LIV-017" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <FormLabel>Device Location</FormLabel>
                <div className='flex items-end gap-2'>
                    <div className='grid grid-cols-2 gap-2 flex-1'>
                         <FormField
                            control={form.control}
                            name="lat"
                            render={({ field }) => (
                            <FormItem>
                                <Label className="text-xs text-muted-foreground">Latitude</Label>
                                <FormControl>
                                <Input type="number" step="any" placeholder="e.g., 28.6139" {...field} />
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
                                <Label className="text-xs text-muted-foreground">Longitude</Label>
                                <FormControl>
                                <Input type="number" step="any" placeholder="e.g., 77.2090" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                     <Dialog open={isMapOpen} onOpenChange={setMapOpen}>
                        <DialogTrigger asChild>
                            <Button type="button" variant="outline">
                                <MapPin className="mr-2 h-4 w-4" /> Pick on Map
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="h-[70vh] max-w-[90vw] p-2 flex flex-col lg:max-w-[70vw]">
                            <DialogHeader className="p-4 flex-shrink-0">
                                <DialogTitle>Click on the map to set location</DialogTitle>
                            </DialogHeader>
                            <div className="flex-grow w-full overflow-hidden rounded-lg">
                                {isMapOpen && <AddDeviceMap onLocationSelect={handleLocationSelect} />}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requirements / Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Needs to be installed near the main reservoir." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Device
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
