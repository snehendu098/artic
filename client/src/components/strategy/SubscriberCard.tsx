import { Eye, View, ViewIcon } from "lucide-react";
import CoreCardLayout from "../cards/CoreCardLayout";
import { Button } from "../ui/button";

const data = [1, 2, 4];

const SubscribersCard = () => {
  return (
    <div className="w-full flex flex-col space-y-2">
      <CoreCardLayout className={"flex flex-col items-center"}>
        <p className="text-lg font-semibold">Subscribers</p>
        <div className="w-full py-4 flex text-primary items-center justify-center text-5xl font-semibold">
          4
        </div>

        <div className="flex flex-col space-y-2 w-full">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="flex w-full p-4 border rounded-md bg-neutral-900/50 items-center justify-between"
            >
              <div>0x01...9dA</div>
              <Button size={"sm"} variant="secondary">
                <Eye className="text-primary" />
              </Button>
            </div>
          ))}
        </div>
      </CoreCardLayout>
    </div>
  );
};

export default SubscribersCard;
