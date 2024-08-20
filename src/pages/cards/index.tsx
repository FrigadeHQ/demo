import * as Frigade from '@frigade/react';
import { useFlow } from '@frigade/react';
import { Button } from '@/components/ui/button';
import { DemoCard } from '@/components/demo-card';
import { useState } from 'react';
import { BANNER_CARD_FLOW_ID, CARD_FLOW_ID } from '@/lib/flow-details';

export default function Cards() {
  const [isResetting, setIsResetting] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [showCard, setShowCard] = useState(true);

  // set two constants for two different Frigade Flows
  const { flow: flowOne } = useFlow(CARD_FLOW_ID);
  const { flow: flowTwo } = useFlow(BANNER_CARD_FLOW_ID);

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="grid grid-cols-4 gap-4">
          {showBanner && (
            <Frigade.Banner
              flowId={BANNER_CARD_FLOW_ID}
              dismissible={false}
              className="!rounded-xl border !border-muted bg-card text-card-foreground shadow col-span-4"
            />
          )}
          {showCard && (
            <DemoCard
              title="Demo Card"
              value="$10,000"
              subtitle="Lorem ipsum dolor"
            />
          )}
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
            onClick={async () => {
              setShowBanner(false);
              setShowCard(false);
              setIsResetting(true);
              await flowOne?.restart();
              await flowTwo?.restart();
              setIsResetting(false);
              setShowBanner(true);
              setShowCard(true);
            }}
            disabled={isResetting}
          >
            Reset demo
          </Button>
        </div>
      </div>
    </>
  );
}
