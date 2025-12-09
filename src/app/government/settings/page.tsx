import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function GovernmentSettingsPage() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="font-headline text-2xl md:text-3xl font-bold">Settings</h1>
            <Card className="flex flex-1 items-center justify-center border-dashed">
                <CardContent className="py-10 text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-muted p-4">
                            <Settings className="h-12 w-12 text-muted-foreground" />
                        </div>
                    </div>
                    <CardTitle className="mb-2 text-xl">Portal Settings</CardTitle>
                    <p className="max-w-xs text-center text-muted-foreground">
                        Manage your profile and portal preferences here.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
