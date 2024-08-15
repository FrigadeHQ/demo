import { Modals } from '@/components/modals';

export default function Page() {
  // set two constants for two different Frigade Flows

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="grid grid-cols-3 gap-2">
          <Modals />
        </div>
      </div>
    </>
  );
}
