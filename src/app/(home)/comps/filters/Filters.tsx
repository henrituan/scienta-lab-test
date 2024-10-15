import { AgeFilter } from './AgeFilter';
import { FemalePercentFilter } from './FemalePercentFilter';
import { MaxVisblePointsFilter } from './MaxVisiblePoints';
import { SymptomFilter } from './SymptomFilter';

export const Filters = () => {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 max-w-[50vw]">
      <div className="grid grid-cols-[8rem,10rem] items-center">
        <span>Age</span>
        <AgeFilter />
      </div>
      <div className="grid grid-cols-[15rem,10rem] items-center">
        <span>Female percentage</span>
        <FemalePercentFilter />
      </div>
      <div className="grid grid-cols-[8rem,1fr] items-center">
        <span>Symptoms</span>
        <SymptomFilter />
      </div>
      <div className="grid grid-cols-[15rem,1fr] items-center">
        <div className="flex flex-col">
          <span>Max visible points</span>
          <p className="text-xs">Higher value requires more energy</p>
        </div>
        <MaxVisblePointsFilter />
      </div>
    </div>
  );
};
