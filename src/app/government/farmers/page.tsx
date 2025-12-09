import FarmerList from "@/components/government/farmer-list";

export default function GovernmentFarmersPage() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="font-headline text-2xl md:text-3xl font-bold">Farmer Database</h1>
            <div className="grid grid-cols-1 gap-6">
                <FarmerList />
            </div>
        </div>
    )
}
