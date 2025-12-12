'use client';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, ChevronRight, Languages, Palette } from 'lucide-react';
import LanguageSwitcher from '@/components/layout/language-switcher';
import ThemeToggle from '@/components/layout/theme-toggle';


export default function FarmerSettingsPage() {

    return (
        <div className="flex flex-col gap-8 pb-20 md:pb-6">
            <h1 className="font-headline text-2xl md:text-3xl font-bold">Settings</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>App Preferences</CardTitle>
                    <CardDescription>Manage your application settings and preferences.</CardDescription>
                </CardHeader>
                <CardContent className="divide-y p-0">
                    <div className="flex items-center justify-between p-4">
                         <div className="flex items-center gap-4">
                            <Languages className="h-5 w-5 text-muted-foreground" />
                            <span className="flex-1">Language</span>
                        </div>
                        <LanguageSwitcher />
                    </div>
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <Palette className="h-5 w-5 text-muted-foreground" />
                            <span className="flex-1">Theme</span>
                        </div>
                        <ThemeToggle />
                    </div>
                     <Button variant="ghost" className="w-full justify-start p-4 rounded-none">
                        <div className="flex items-center gap-4 w-full">
                            <Bell className="mr-4 h-5 w-5 text-muted-foreground" />
                            <span className="flex-1 text-left">Notification Preferences</span>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </Button>
                </CardContent>
            </Card>

        </div>
    );
}
