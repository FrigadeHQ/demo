import { Hints } from '@/components/hints';

export default function Index() {
  return (
    <div className="relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-4 lg:px-0">
      <div className="col-span-4">
        <Hints />
      </div>
    </div>
  );
}
