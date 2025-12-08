import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { List, ChevronRight } from "lucide-react";
import LanguageSwitcher from "@/components/layout/language-switcher";

export default function SettingsPage() {
    const avatarImage = PlaceHolderImages.find(img => img.id === 'farmer-avatar');

    return (
        <div className="flex flex-col gap-6 pb-20">
            <h1 className="font-headline text-3xl font-bold">Settings</h1>
            <Card>
                <CardHeader className="text-center">
                    <Avatar className="mx-auto h-24 w-24 border-4 border-primary">
                        {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt="User Avatar" data-ai-hint={avatarImage.imageHint} />}
                        <AvatarFallback>AV</AvatarFallback>
                    </Avatar>
                    <CardTitle className="mt-4">Alex Doe</CardTitle>
                    <CardDescription>Farmer</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" className="w-full">Edit Profile</Button>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="divide-y p-0">
                    <div className="flex items-center p-4">
                        <List className="mr-4" />
                        <span className="flex-1">Account</span>
                        <ChevronRight />
                    </div>
                     <div className="flex items-center p-4">
                        <List className="mr-4" />
                        <span className="flex-1">Notifications</span>
                        <ChevronRight />
                    </div>
                    <div className="flex items-center p-4">
                         <span className="flex-1">Language</span>
                         <LanguageSwitcher />
                    </div>
                </CardContent>
            </Card>

             <Button variant="destructive">Logout</Button>

        </div>
    );
}
