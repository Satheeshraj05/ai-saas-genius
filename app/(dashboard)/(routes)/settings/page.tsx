
import { Settings } from "lucide-react";
import { Heading } from "@/components/Heading";

const SettingPage = async () => {
    return (
        <div>
            <Heading
                title="Setting"
                description="Manage account setting."
                icon={() => (
                    <div className="bg-grey-700  py-2 px-4 rounded">
                        <Settings className="text-grey-700" />
                    </div>
                )}
                iconColor="text-grey-700"
                bgColor="bg-grey-700/10"
            />
            <div className="px-4 lg:px-8 space-y-4">
                <div className="text-muted-foreground text-sm">
                    You are currently on a pro plan.
                </div>
                <div>
                    <button type="button" className="bg-purple-500 text-white py-2 px-4 rounded">
                        <a href="/">Manage Subscription</a>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingPage;
