'use client';

import * as Frigade from '@frigade/react';
import { useFlow } from '@frigade/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bird, Rabbit, Turtle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HINT_FLOW_ID } from '@/lib/flow-details';

export function Hints() {
  const { flow: hintFlow } = useFlow(HINT_FLOW_ID);
  const [isResetting, setIsResetting] = useState(false);

  const [isHintVisible, setIsHintVisible] = useState(true);

  return (
    <div className="relative hidden flex-col items-start gap-6 md:flex">
      {isHintVisible && (
        <Frigade.Tour
          flowId="flow_QoSHPAnV"
          defaultOpen={false}
          sequential={false}
          dismissible={true}
          pointerEvents="none"
          css={{
            zIndex: 10,
            position: 'fixed',
            inset: 0,
            border: '1px solid hsl(var(--border))',
            '.fr-progress': {
              display: 'none',
            },
            '.fr-button-secondary': {
              backgroundColor: 'transparent',
              border: '1px solid border-muted',
            },
            '.fr-tooltip-footer:not(:has(button))': {
              display: 'none',
            },
            '& *': {
              pointerEvents: 'auto',
            },
          }}
        />
      )}
      <Card className="border-muted" id="model-card">
        <CardHeader>
          <CardTitle>Demo card</CardTitle>
          <CardDescription id="demo-card-subtitle">
            Tap the <b>Reset Hints</b> button below to restart the demo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative hidden flex-col items-start gap-8 md:flex">
            <form className="grid w-full items-start gap-6">
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Settings
                </legend>
                <div className="grid gap-3">
                  <Label htmlFor="model">Model</Label>
                  <Select>
                    <SelectTrigger
                      id="model"
                      className="items-start [&_[data-description]]:hidden"
                    >
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent className="!z-20">
                      <SelectItem value="genesis">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <Rabbit className="size-5" />
                          <div className="grid gap-0.5">
                            <p>
                              Neural{' '}
                              <span className="font-medium text-foreground">
                                Genesis
                              </span>
                            </p>
                            <p className="text-xs" data-description>
                              Our fastest model for general use cases.
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="explorer">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <Bird className="size-5" />
                          <div className="grid gap-0.5">
                            <p>
                              Neural{' '}
                              <span className="font-medium text-foreground">
                                Explorer
                              </span>
                            </p>
                            <p className="text-xs" data-description>
                              Performance and speed for efficiency.
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="quantum">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <Turtle className="size-5" />
                          <div className="grid gap-0.5">
                            <p>
                              Neural{' '}
                              <span className="font-medium text-foreground">
                                Quantum
                              </span>
                            </p>
                            <p className="text-xs" data-description>
                              The most powerful model for complex computations.
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input id="temperature" type="number" placeholder="0.4" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="top-p">Top P</Label>
                    <Input id="top-p" type="number" placeholder="0.7" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="top-k">Top K</Label>
                    <Input id="top-k" type="number" placeholder="0.0" />
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-row gap-4 w-full">
        <Button
          className="flex w-full"
          disabled={isResetting}
          onClick={async () => {
            setIsResetting(true);
            setIsHintVisible(false);
            await hintFlow?.restart();
            setIsResetting(false);
            setIsHintVisible(true);
          }}
        >
          Reset Hints
        </Button>
      </div>
    </div>
  );
}
