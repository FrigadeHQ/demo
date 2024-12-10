import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

export function DemoCard(props: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <Card className="col-span-1 w-[200px] border-muted rounded-xl fr-card">
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
