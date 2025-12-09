import { GovDeviceTable } from "@/components/government/gov-device-table";

export default function GovernmentDevicesPage() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="font-headline text-2xl md:text-3xl font-bold">Device Management</h1>
            <GovDeviceTable />
        </div>
    );
}
