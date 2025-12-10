'use client';

import { useEffect, useState } from 'react';
import { getFarmerProfile } from '@/app/api/farmer-data';
import { useRole } from '@/contexts/role-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, MapPin, Tractor, HardDrive, Edit, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';

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


export default function FarmerProfilePage() {
  const { user } = useRole();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const avatarImage = PlaceHolderImages.find(
    (img) => img.id === 'farmer-avatar'
  );

  useEffect(() => {
    if (!user?.phoneNumber) {
      setLoading(false);
      return;
    };
    (async () => {
      try {
        setLoading(true);
        const p = await getFarmerProfile(user.phoneNumber);
        setProfile(p);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (loading) {
    return (
        <div className="flex flex-col gap-6 pb-20 md:pb-6">
            <div className="flex items-center justify-between">
              <h1 className="font-headline text-2xl md:text-3xl font-bold">Your Profile</h1>
              <Skeleton className="h-10 w-24" />
            </div>
            <Card>
                <CardHeader className="text-center">
                    <Skeleton className="mx-auto h-24 w-24 rounded-full" />
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
  if (!profile) return <div className="p-6 text-center">No profile found. You may need to log in again.</div>;

  return (
    <div className="flex flex-col gap-8 pb-20 md:pb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="font-headline text-2xl md:text-3xl font-bold">Your Profile</h1>
        <Button>
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>
      
      <Card>
        <CardHeader className="items-center text-center">
          <Avatar className="mx-auto h-24 w-24 border-4 border-primary">
            {avatarImage && (
              <AvatarImage
                src={avatarImage.imageUrl}
                alt="User Avatar"
                data-ai-hint={avatarImage.imageHint}
              />
            )}
            <AvatarFallback>{profile.name ? profile.name.charAt(0) : 'F'}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <CardTitle className="mt-4">{profile.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{profile.phone}</p>
          </div>
        </CardHeader>
        <CardContent>
             <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <ProfileItem label="Aadhaar" value={profile.aadhaar} icon={User} />
                <ProfileItem label="Address" value={`${profile.address}, ${profile.village}, ${profile.district}`} icon={MapPin} />
             </div>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tractor className="h-6 w-6"/>
            <span>My Land Plots</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.plots?.length > 0 ? (
            profile.plots.map((plot: any, index: number) => (
              <div key={index} className="rounded-lg border bg-muted/20 p-4">
                <p className="font-bold">Survey No: {plot.surveyNumber}</p>
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <p><span className="font-semibold">Area:</span> {plot.areaAcres} acres</p>
                  <p><span className="font-semibold">Land Type:</span> {plot.landType}</p>
                  <p><span className="font-semibold">Soil Type:</span> {plot.soilType}</p>
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
            <span>My Devices</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.devices && profile.devices.length > 0 ? (
            profile.devices.map((device: any) => (
              <div key={device.id} className="flex items-center justify-between rounded-lg border bg-muted/20 p-4">
                <div>
                  <p className="font-bold">{device.nickname}</p>
                  <p className="text-sm text-muted-foreground">{device.id} - Linked to Plot: {device.surveyNumber}</p>
                   <p className="text-sm text-muted-foreground">Jalkund Capacity: {device.jalkundMaxQuantity}L</p>
                </div>
                <Badge variant={device.status === 'Online' ? 'default' : 'destructive'} className={device.status === 'Online' ? 'bg-green-600' : ''}>
                  {device.status}
                </Badge>
              </div>
            ))
          ) : (
             <p className="text-muted-foreground">No devices have been registered for your account.</p>
          )}
        </CardContent>
      </Card>

      <Button variant="destructive">
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  );
}
