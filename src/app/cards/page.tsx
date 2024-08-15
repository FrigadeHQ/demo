'use client';
import { DollarSign } from 'lucide-react';
import * as Frigade from '@frigade/react';
import { useFlow } from '@frigade/react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
            className="!rounded-xl border bg-card text-card-foreground shadow col-span-4"
          />
          <DemoCard
            title="Demo Card"
            value="$10,000"
            subtitle="Lorem ipsum dolor"
          />
          <Frigade.Card
            flowId={CARD_FLOW_ID}
            dismissible={true}
            className="!rounded-xl border bg-card text-card-foreground shadow w-[200px] col-span-1"
            css={{
              '.fr-card-footer:not(:has(button))': {
                display: 'none',
              },
              '.fr-title': {
                fontSize: '14px',
                fontWeight: 500,
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
        <div className="flex flex-row w-full">
          {/*on click, reset flowOne and flowTwo*/}
          <Button
            className="flex w-full"
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

export function DemoCard(props: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <Card className="col-span-1 w-[200px] border-muted rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{props.title}</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{props.value}</div>
        <p className="text-xs text-muted-foreground">{props.subtitle}</p>
      </CardContent>
    </Card>
  );
}
