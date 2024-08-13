'use client';

import * as Frigade from '@frigade/react';
import { useFlow } from '@frigade/react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Forms() {
  const ONBOARDING_FORM_FLOW_ID = 'flow_kTB2fci9';
  const { flow } = useFlow(ONBOARDING_FORM_FLOW_ID);
  const [isPaused, setIsPaused] = useState(false);
  const progress =
    (Math.max(flow?.getCurrentStepIndex() || 0, 0.05) /
      (flow?.getNumberOfAvailableSteps() || 1)) *
    100;

  if (!flow) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner />
      </div>
    );
  }

  if (flow?.isCompleted) {
    return (
      <div className="flex items-center justify-center w-full h-full flex-col gap-4">
        <h1>Flow is completed</h1>
        <Button onClick={() => flow?.restart()}>Restart form</Button>
      </div>
    );
  }

  if (isPaused) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="w-[300px] text-sm flex flex-col gap-4">
          <div>
            <strong>{flow?.getCurrentStepIndex()}</strong> of{' '}
            <strong>{flow?.getNumberOfAvailableSteps()} steps completed</strong>
          </div>
          <Progress value={progress} />

          <Button onClick={() => setIsPaused(false)} size="sm">
            Resume
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-4 lg:px-0 overflow-y-scroll">
        <div className="col-span-4">
          <Card className="md:w-[500px] w-full flex flex-col justify-center mx-auto shadow-sm pb-5 overflow-hidden">
            <Progress value={progress} className="rounded-none" />
            <div className="flex flex-col justify-center space-y-6 w-full px-5">
              {flow?.isCompleted || !flow ? (
                <div className="flex items-center justify-center w-full h-full">
                  <Spinner />
                </div>
              ) : (
                <div className="flex-col justify-center w-full">
                  <Frigade.Form
                    flowId={ONBOARDING_FORM_FLOW_ID}
                    className="onboarding-form pt-12 pb-4"
                    css={{
                      '.fr-button-primary': {
                        width: '100%',
                      },
                      '.fr-field-label': {
                        fontSize: '14px',
                        marginBottom: '14px',
                        lineHeight: '22px',
                      },
                      '.fr-field-check-value, .fr-field-radio-value': {
                        width: '20px',
                        height: '20px',
                      },
                      '.fr-field-check-label, .fr-field-radio-label': {
                        lineHeight: '20px',
                      },
                      '.fr-field-input, .fr-field-select': {
                        height: '38px',
                      },
                      '.fr-field-radio:hover, .fr-field-check:hover': {
                        borderColor: 'var(--fr-colors-primary-background)',
                      },
                      '.fr-field-label-required': {
                        display: 'none',
                      },
                      '.fr-field-select-icon': {
                        color: 'var(--fr-colors-neutral-foreground)',
                      },
                      '.fr-field-radio': {
                        cursor: 'pointer',
                      },
                      '.fr-field-check, .fr-field-radio': {
                        height: '38px',
                      },
                      // FIXME/HELPME: @micah for some reason this doesn't work.
                      // '.fr-field-select-option:hover': {
                      //   backgroundColor: 'var(--fr-colors-secondary-hover-background)',
                      // },
                    }}
                  />
                  <Button
                    variant="link"
                    onClick={() => {
                      setIsPaused(true);
                    }}
                  >
                    <p className="text-sm text-muted-foreground">
                      Skip for now
                    </p>
                  </Button>
                </div>
              )}
            </div>
            <style>
              {`
                .fr-field-select-option:hover {
                  background-color: var(--fr-colors-secondary-hover-background);
                }
                .fr-field-select-option {
                  height: 38px;
                }
                .fr-field-select-option-label {
                  display: flex;
                  line-height: 22px;
                }
              `}
            </style>
          </Card>
        </div>
      </div>
    </>
  );
}
