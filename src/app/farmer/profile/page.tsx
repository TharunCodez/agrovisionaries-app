'use client';

import { useRef, useState } from 'react';
import { useData } from '@/contexts/data-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, MapPin, Tractor, HardDrive, Edit, LogOut, Upload, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useRole } from '@/contexts/role-context';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { signOut } from 'firebase/auth';

function ProfileItem({ label, value, icon: Icon }: { label: string; value: any, icon?: React.ElementType }) {
    const IconComponent = Icon || User;
    return (
        <div className="flex items-start gap-3">
            {Icon && <IconComponent className="h-5 w-5 mt-1 text-primary"/>}
            <div>
                <p className="font-semibold">{label}</p>
                <p className="text-muted-foreground">{value ?? '—'}</p>
            </div>
        </div>
    );
}

function ProfileLoading() {
    const { t } = useTranslation();
     return (
        <div className="flex flex-col gap-6 pb-20 md:pb-6">
            <div className="flex items-center justify-between">
              <h1 className="font-headline text-2xl md:text-3xl font-bold">{t('your_profile')}</h1>
              <Skeleton className="h-10 w-24" />
            </div>
            <Card>
                <CardHeader className="text-center">
                    <Skeleton className="mx-auto h-28 w-28 rounded-full" />
                    <Skeleton className="h-6 w-32 mx-auto mt-4" />
                    <Skeleton className="h-4 w-24 mx-auto mt-2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
    )
}

function useLogout() {
  const router = useRouter();
  const { setUser, setRole } = useRole();
  const { setFarmers } = useData();
  const { toast } = useToast();

  return async () => {
    try {
      await signOut(auth);
      // Clear local state
      setUser(null);
      setRole(null);
      if (setFarmers) {
        setFarmers([]); // Clear data context
      }
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
      localStorage.removeItem('agrovisionaries-locale');
      
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });

      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
       toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: (error as Error).message || 'An unexpected error occurred.',
      });
    }
  };
}


export default function FarmerProfilePage() {
  const { farmers, devices, isLoading: isDataLoading, setFarmers } = useData();
  const { user } = useRole();
  const { t } = useTranslation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const handleLogout = useLogout();
  
  const farmer = farmers?.[0];

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !farmer || !user) return;

    setUploading(true);

    try {
      const storageRef = ref(storage, `profilePhotos/${user.uid}/farmer_img.jpg`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateDoc(doc(db, "farmers", user.uid), { photoUrl: url });

      if (setFarmers) {
          setFarmers(prev => {
              if (!prev || prev.length === 0) return [];
              const newFarmers = [...prev];
              newFarmers[0] = { ...newFarmers[0], photoUrl: url };
              return newFarmers;
          });
      }

      toast({
        title: 'Photo Uploaded!',
        description: 'Your new profile picture has been saved.',
      });
    } catch (err: any) {
       toast({
        variant: "destructive",
        title: 'Upload Failed',
        description: err.message || 'Could not upload your photo.',
      });
    } finally {
      setUploading(false);
    }
  };

  if (isDataLoading || !farmer) {
    return <ProfileLoading />
  }

  return (
    <div className="flex flex-col gap-8 pb-20 md:pb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="font-headline text-2xl md:text-3xl font-bold">{t('your_profile')}</h1>
        <Button disabled>
          <Edit className="mr-2 h-4 w-4" />
          {t('edit_profile')}
        </Button>
      </div>
      
      <Card>
        <CardHeader className="items-center text-center">
          <div className="relative">
            <Avatar className="mx-auto h-28 w-28 border-4 border-primary">
                <AvatarImage
                    src={farmer?.photoUrl ?? ''}
                    alt={farmer?.name ?? 'Farmer'}
                />
                <AvatarFallback>{farmer?.name ? farmer.name.charAt(0).toUpperCase() : 'F'}</AvatarFallback>
            </Avatar>
            <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                className="hidden" 
            />
             <Button 
                size="icon" 
                className="absolute bottom-0 right-0 rounded-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
               {uploading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Upload className="h-4 w-4"/>}
            </Button>
          </div>
          <div className="text-center mt-4">
            <CardTitle>{farmer?.name ?? 'N/A'}</CardTitle>
            <p className="text-sm text-muted-foreground">{farmer?.phone ?? 'N/A'}</p>
          </div>
        </CardHeader>
        <CardContent>
             <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <ProfileItem label={t('aadhaar')} value={farmer?.aadhaar ?? 'N/A'} icon={User} />
                <ProfileItem label={t('address')} value={`${farmer?.address ?? ''}, ${farmer?.village ?? ''}, ${farmer?.district ?? ''}`} icon={MapPin} />
             </div>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tractor className="h-6 w-6"/>
            <span>{t('landPlots')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {farmer?.plots?.length > 0 ? (
            farmer.plots.map((plot) => (
              <div key={plot.surveyNumber} className="rounded-lg border bg-muted/20 p-4">
                <p className="font-bold">{t('surveyNumber')}: {plot.surveyNumber}</p>
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <p><span className="font-semibold">{t('area')}:</span> {plot.areaAcres} acres</p>
                  <p><span className="font-semibold">{t('landType')}:</span> {plot.landType}</p>
                  <p><span className="font-semibold">{t('soilType')}:</span> {plot.soilType}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No land plots have been registered for your account.</p>
          )}
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-6 w-6"/>
            <span>{t('myDevices')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {devices && devices.length > 0 ? (
            devices.map((device) => (
              <div key={device.id} className="rounded-lg border bg-muted/20 p-4">
                  <p className="font-bold">Device ID: {device.id}</p>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <p><span className="font-semibold">Status:</span> {device.status}</p>
                    <p><span className="font-semibold">{t('reservoir_level')}:</span> {device.waterLevel}%</p>
                    <p><span className="font-semibold">{t('soil_moisture')}:</span> {device.soilMoisture}%</p>
                  </div>
              </div>
            ))
          ) : (
             <p className="text-muted-foreground">No devices have been registered for your account.</p>
          )}
        </CardContent>
      </Card>

      <Button variant="destructive" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        {t('logout')}
      </Button>
    </div>
  );
}
