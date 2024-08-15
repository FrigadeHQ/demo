'use client';

import * as Frigade from '@frigade/react';
import { useFlow } from '@frigade/react';
import { Button } from '@/components/ui/button';
import { DemoCard } from '@/components/demo-card';

const CARD_FLOW_ID = 'flow_89rqfLTS';
const BANNER_FLOW_ID = 'flow_yupOQHJs';

export default function Cards() {
  // set two constants for two different Frigade Flows
  const { flow: flowOne } = useFlow(CARD_FLOW_ID);
  const { flow: flowTwo } = useFlow(BANNER_FLOW_ID);

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="grid grid-cols-4 gap-4">
          <Frigade.Banner
            flowId={BANNER_FLOW_ID}
            dismissible={false}
            className="!rounded-xl border !border-muted bg-card text-card-foreground shadow col-span-4"
          />
          <DemoCard
            title="Demo Card"
            value="$10,000"
            subtitle="Lorem ipsum dolor"
          />
          <Frigade.Card
            flowId={CARD_FLOW_ID}
            dismissible={true}
            className="!rounded-xl border !border-muted bg-card text-card-foreground shadow w-[200px] col-span-1"
            css={{
              '.fr-card-footer:not(:has(button))': {
                display: 'none',
              },
              '.fr-title': {
                fontSize: '14px',
                fontWeight: 500,
              },
              '.fr-subtitle': {
                fontSize: '12px',
                // TODO: Make it the same as the other cards
                color: 'muted-foreground',
              },
            }}
          />
          <DemoCard
            title="Demo Card"
            value="95%"
            subtitle="Lorem ipsum dolor"
          />
          <DemoCard
            title="Demo Card"
            value="888"
            subtitle="Lorem ipsum dolor"
          />
        </div>
        <div className="flex flex-row w-full justify-center">
          {/*on click, reset flowOne and flowTwo*/}
          <Button
            className="flex"
            variant="outline"
            onClick={() => {
              flowOne?.restart();
              flowTwo?.restart();
            }}
          >
            Reset demo
          </Button>
        </div>
      </div>
    </>
  );
}
