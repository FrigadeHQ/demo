'use client';
import * as Frigade from '@frigade/react';
import { useFlow } from '@frigade/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CHECKLIST_FLOW_ID = 'flow_lSjFTcXz';

export default function Checklists() {
  // set two constants for two different Frigade Flows
  const { flow } = useFlow(CHECKLIST_FLOW_ID);

  return (
    <div className="items-center justify-center flex flex-col w-full mt-4">
      <Frigade.Checklist.Carousel
        flowId={CHECKLIST_FLOW_ID}
        forceMount={true}
        className="w-full"
        css={{
          '.fr-carousel-next-wrapper': {
            background:
              'linear-gradient(to left, var(--fr-colors-primary-foreground), transparent 50%)',
          },
          '.fr-carousel-prev-wrapper': {
            background:
              'linear-gradient(to right, var(--fr-colors-primary-foreground), transparent 50%)',
          },
        }}
      />

      <div className="flex flex-row justify-center mt-8 gap-6 items-center border border-muted w-auto p-6 rounded-md">
        <Button
          variant="default"
          className="flex"
          onClick={() => {
            flow.steps.get('checklist-step-two')?.complete();
          }}
        >
          User action
        </Button>
        <Input
          placeholder="Write 'native'"
          className="w-[130px]"
          onChange={(e) => {
            if (e.target.value === 'native') {
              flow.steps.get('checklist-step-four')?.complete();
            }
          }}
        />
        <div className="border-r border-muted h-6"></div>
        <Button
          variant="ghost"
          className="flex"
          onClick={() => {
            flow.restart();
            document.querySelector('input')!.value = '';
          }}
        >
          Reset checklist
        </Button>
      </div>
    </div>
  );
}
