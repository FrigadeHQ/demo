'use client';

import * as Frigade from '@frigade/react';
import { useFlow } from '@frigade/react';

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const TOUR_FLOW_ID = 'flow_F0MP8vnI';
const BANNER_FLOW_ID = 'flow_LrVN8xha';

export default function Tours() {
  return (
    <div className="relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-4 lg:px-0">
      <div className="col-span-4">
        <Frigade.Tour
          flowId={TOUR_FLOW_ID}
          align="before"
          dismissible={false}
          css={{
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
          }}
        />
        <Component />
      </div>
    </div>
  );
}

export function Component() {
  const { flow: flowOne } = useFlow(TOUR_FLOW_ID);
  const { flow: flowTwo } = useFlow(BANNER_FLOW_ID);
  return (
    <div className="relative hidden flex-col items-start gap-6 md:flex">
      <Frigade.Banner
        flowId={BANNER_FLOW_ID}
        dismissible={true}
        className="flex flex-row gap-4 w-full rounded-xl border border-muted bg-card text-card-foreground shadow"
      />
      <Card className="border-muted">
        <CardHeader>
          <CardTitle>Demo card</CardTitle>
          <CardDescription id="demo-card-subtitle">
            Lipsum dolor sit amet, consectetur adipiscing elit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-[100px]">Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold">One</TableCell>
                <TableCell>
                  <Label htmlFor="stock-1" className="sr-only">
                    Stock
                  </Label>
                  <Input
                    id="stock-1"
                    type="number"
                    defaultValue="20"
                    onChange={
                      // if the value is greater than 100, complete the current Frigade step
                      (e) => {
                        if (
                          parseInt(e.target.value) > 100 &&
                          flowOne.getCurrentStep()?.id === 'tour-step-two'
                        ) {
                          flowOne.getCurrentStep()?.complete();
                        }
                      }
                    }
                  />
                </TableCell>
                <TableCell>
                  <Label htmlFor="price-1" className="sr-only">
                    Price
                  </Label>
                  <Input id="price-1" type="number" defaultValue="99.99" />
                </TableCell>
                <TableCell>
                  <ToggleGroup type="single" defaultValue="s" variant="outline">
                    <ToggleGroupItem value="s">S</ToggleGroupItem>
                    <ToggleGroupItem value="m">M</ToggleGroupItem>
                    <ToggleGroupItem value="l">L</ToggleGroupItem>
                  </ToggleGroup>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Two</TableCell>
                <TableCell>
                  <Label htmlFor="stock-2" className="sr-only">
                    Stock
                  </Label>
                  <Input id="stock-2" type="number" defaultValue="143" />
                </TableCell>
                <TableCell>
                  <Label htmlFor="price-2" className="sr-only">
                    Price
                  </Label>
                  <Input id="price-2" type="number" defaultValue="99.99" />
                </TableCell>
                <TableCell>
                  <ToggleGroup type="single" defaultValue="m" variant="outline">
                    <ToggleGroupItem value="s">S</ToggleGroupItem>
                    <ToggleGroupItem value="m">M</ToggleGroupItem>
                    <ToggleGroupItem value="l">L</ToggleGroupItem>
                  </ToggleGroup>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Three</TableCell>
                <TableCell>
                  <Label htmlFor="stock-3" className="sr-only">
                    Stock
                  </Label>
                  <Input id="stock-3" type="number" defaultValue="32" />
                </TableCell>
                <TableCell>
                  <Label htmlFor="price-3" className="sr-only">
                    Stock
                  </Label>
                  <Input id="price-3" type="number" defaultValue="99.99" />
                </TableCell>
                <TableCell>
                  <ToggleGroup
                    type="single"
                    defaultValue="s"
                    variant="outline"
                    id="demo-button-group"
                  >
                    <ToggleGroupItem value="s">S</ToggleGroupItem>
                    <ToggleGroupItem
                      onClick={() => flowOne.getCurrentStep()?.complete()}
                      value="m"
                    >
                      M
                    </ToggleGroupItem>
                    <ToggleGroupItem value="l">L</ToggleGroupItem>
                  </ToggleGroup>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="flex flex-row gap-4 w-full">
        <Button
          className="flex w-full"
          onClick={() => {
            flowOne?.restart();
            flowTwo?.restart();
          }}
        >
          Launch Tour
        </Button>
      </div>
    </div>
  );
}
