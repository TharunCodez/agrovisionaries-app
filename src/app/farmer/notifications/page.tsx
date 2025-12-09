import SmartAlert from "@/components/dashboard/smart-alert";

export default function FarmerNotificationsPage() {
    return (
        <div className="flex flex-col gap-6 pb-20 md:pb-6">
            <h1 className="font-headline text-2xl md:text-3xl font-bold">Alerts</h1>
            <SmartAlert />
        </div>
    );
}
