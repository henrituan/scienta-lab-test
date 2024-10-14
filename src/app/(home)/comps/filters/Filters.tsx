import { AgeFilter } from './AgeFilter';
import { FemalePercentFilter } from './FemalePercentFilter';
import { SymptomFilter } from './SymptompFilter';

export const Filters = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-[8rem,10rem]">
        <span>Age</span>
        <AgeFilter />
      </div>
      <div className="grid grid-cols-[8rem,10rem]">
        <span>Female %</span>
        <FemalePercentFilter />
      </div>
      <div className="grid grid-cols-[8rem,1fr]">
        <span>Symptoms</span>
        <SymptomFilter />
      </div>
    </div>
  );
};