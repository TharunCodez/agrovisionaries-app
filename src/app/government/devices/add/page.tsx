'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, MapPin, Loader2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/data-context';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const AddDeviceMap = dynamic(() => import('@/components/government/add-device-map'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

const formSchema = z.object({
  farmerId: z.string().nonempty({ message: 'Farmer is required.' }),
  deviceId: z.string().nonempty({ message: 'Device ID is required.' }),
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  deviceType: z.string().nonempty({ message: 'Device type is required.' }),
  notes: z.string().optional(),
});

export default function AddDevicePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { farmers, addDevice, getNextDeviceId } = useData();
  const [isMapOpen, setMapOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const defaultDeviceId = useMemo(() => getNextDeviceId(), [getNextDeviceId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      farmerId: '',
      deviceId: defaultDeviceId,
      lat: 28.6139,
      lng: 77.209,
      deviceType: '',
      notes: '',
    },
  });

  const selectedFarmerId = form.watch('farmerId');
  const selectedFarmer = useMemo(() => farmers.find(f => f.id === selectedFarmerId), [farmers, selectedFarmerId]);

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
        farmerId: values.farmerId,
        name: `${selectedFarmer?.name}'s ${values.deviceType}`,
        location: `Lat: ${values.lat.toFixed(4)}, Lng: ${values.lng.toFixed(4)}`,
        status: 'Online' as const,
        lastUpdated: new Date(),
        region: selectedFarmer?.region || 'Unknown',
        lat: values.lat,
        lng: values.lng,
        temperature: 25, // Mock initial data
        humidity: 60,
        soilMoisture: 50,
        rssi: -80,
        health: 'Good' as const,
        waterLevel: 70,
        type: values.deviceType
    };
    
    addDevice(newDevice);

    toast({
      title: 'Device Added Successfully!',
      description: `${newDevice.id} has been registered for ${selectedFarmer?.name}.`,
    });
    
    setIsLoading(false);
    router.push('/government/devices');
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-2xl md:text-3xl font-bold">Add New Device</h1>
      <Card>
        <CardHeader>
          <CardTitle>Device Registration Form</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="farmerId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Farmer Name</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn('justify-between', !field.value && 'text-muted-foreground')}
                          >
                            {field.value ? farmers.find((f) => f.id === field.value)?.name : 'Select farmer'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Search farmer..." />
                          <CommandList>
                            <CommandEmpty>No farmer found.</CommandEmpty>
                            <CommandGroup>
                              {farmers.map((farmer) => (
                                <CommandItem
                                  value={farmer.name}
                                  key={farmer.id}
                                  onSelect={() => {
                                    form.setValue('farmerId', farmer.id);
                                  }}
                                >
                                  <Check className={cn('mr-2 h-4 w-4', farmer.id === field.value ? 'opacity-100' : 'opacity-0')} />
                                  {farmer.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label htmlFor="farmer-phone">Farmer Phone Number</Label>
                <Input id="farmer-phone" value={selectedFarmer?.phone || ''} readOnly placeholder="Auto-filled" />
              </div>

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
                                <FormLabel className="text-xs text-muted-foreground">Latitude</FormLabel>
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
                                <FormLabel className="text-xs text-muted-foreground">Longitude</FormLabel>
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
                        <DialogContent className="h-[70vh] max-w-[90vw] p-2 lg:max-w-[70vw]">
                            <DialogHeader className="p-4">
                                <DialogTitle>Click on the map to set location</DialogTitle>
                            </DialogHeader>
                            <div className="h-full w-full overflow-hidden rounded-lg">
                                {isMapOpen && <AddDeviceMap onLocationSelect={handleLocationSelect} />}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
              </div>


              <FormField
                control={form.control}
                name="deviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a device type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Multi-Sensor">Multi-Sensor</SelectItem>
                        <SelectItem value="Water Level Sensor">Water Level Sensor</SelectItem>
                        <SelectItem value="Soil Moisture Sensor">Soil Moisture Sensor</SelectItem>
                        <SelectItem value="Pump Controller">Pump Controller</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
