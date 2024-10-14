import { AgeFilter } from './AgeFilter';
import { FemalePercentFilter } from './FemalePercentFilter';
import { SymptomFilter } from './SymptomFilter';

export const Filters = () => {
  return (
    <div className="grid grid-cols-2 grid-rows-2 col gap-4 max-w-[50vw]">
      <div className="grid grid-cols-[8rem,10rem] items-center">
        <span>Age</span>
        <AgeFilter />
      </div>
      <div className="grid grid-cols-[8rem,10rem] items-center">
        <span>Female %</span>
        <FemalePercentFilter />
      </div>
      <div className="grid grid-cols-[8rem,1fr] items-center">
        <span>Symptoms</span>
        <SymptomFilter />
      </div>
    </div>
  );
};
