import { AgeFilter } from './AgeFilter';
import { FemalePercentFilter } from './FemalePercentFilter';
import { MaxVisblePointsFilter } from './MaxVisiblePoints';
import { ProximityRadiusFilter } from './PromixmityRadiusFilter';
import { SymptomFilter } from './SymptomFilter';

export const Filters = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex flex-col gap-2 justify-between">
        <div className="grid grid-cols-[15rem,1fr] items-center">
          <div className="flex flex-col">
            <span>Max visible points</span>
            <p className="text-xs">Higher value requires more energy</p>
          </div>
          <MaxVisblePointsFilter />
        </div>
        <div className="grid grid-cols-[15rem,1fr] items-center">
          <div className="flex flex-col">
            <span>Proximity radius</span>
            <p className="text-xs">Lower value requires more energy</p>
          </div>
          <ProximityRadiusFilter />
        </div>
      </div>

      <div className="flex flex-col gap-2 justify-between">
        <div className="grid grid-cols-[11rem,10rem] items-center">
          <span>Average Age</span>
          <AgeFilter />
        </div>
        <div className="grid grid-cols-[11rem,10rem] items-center">
          <span>Female percentage</span>
          <FemalePercentFilter />
        </div>
      </div>

      <div className="flex flex-col justify-end">
        <SymptomFilter />
      </div>
    </div>
  );
};
