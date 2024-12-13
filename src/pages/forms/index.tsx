'use client';

import * as Frigade from '@frigade/react';
import { useFlow } from '@frigade/react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { MovieTypeaheadField } from '@/components/custom-form-fields/movie-typeahead-field';
import { MandatoryVideoFormField } from '@/components/custom-form-fields/mandatory-video-form-field';
import { FORM_FLOW_ID } from '@/lib/flow-details';

export default function Forms() {
  const { flow } = useFlow(FORM_FLOW_ID);
  const [isPaused, setIsPaused] = useState(false);
  const progress =
    (Math.max(flow?.getCurrentStepOrder() || 0, 0.15) /
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => flow?.restart()}
            className="fr-button-secondary"
          >
            Restart form
          </Button>
          <Button
            onClick={() =>
              window.open(
                'https://app.frigade.com/sign-up?ref=demo_forms',
                '_blank',
              )
            }
            className="fr-button-primary"
          >
            Start building
          </Button>
        </div>
      </div>
    );
  }

  if (isPaused) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="w-[200px] text-sm flex flex-col gap-4 border rounded-md overflow-hidden p-4 fr-card">
          <div className="text-xs">
            <strong>{flow?.getCurrentStepOrder()}</strong> of{' '}
            <strong>{flow?.getNumberOfAvailableSteps()}</strong> steps completed
          </div>

          {/*<Progress value={progress} />*/}

          <Button
            onClick={() => setIsPaused(false)}
            size="sm"
            className="fr-button-primary"
          >
            Resume form
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-4 lg:px-0">
        <div className="col-span-4">
          <Card className="md:w-[500px] bg-card w-full flex flex-col justify-center mx-auto shadow-sm pb-5 overflow-hidden fr-card">
            <Progress
              value={progress}
              className="rounded-none fr-progress-bar"
            />
            <div className="flex flex-col justify-center space-y-6 w-full px-5">
              {flow?.isCompleted || !flow ? (
                <div className="flex items-center justify-center w-full h-full">
                  <Spinner />
                </div>
              ) : (
                <div className="flex-col justify-center w-full relative">
                  <Frigade.Form
                    flowId={FORM_FLOW_ID}
                    className="onboarding-form pt-12"
                    onComplete={() => {
                      console.log('Form completed');
                    }}
                    fieldTypes={{
                      'movie-typeahead': MovieTypeaheadField,
                      'mandatory-video': MandatoryVideoFormField,
                    }}
                    css={{
                      '.fr-form-step-footer': {
                        marginTop: '25px',
                      },
                      '.fr-button-primary': {
                        width: '25%',
                      },
                      '.fr-button-secondary': {
                        width: '25%',
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
                      '.fr-field-label-required': {
                        display: 'none',
                      },
                      '.fr-field-radio': {
                        cursor: 'pointer',
                      },
                      '.fr-field-check, .fr-field-radio': {
                        height: '38px',
                      },
                    }}
                  />
                  <div className="absolute left-0 bottom-0">
                    <Frigade.Button.Link
                      onClick={() => {
                        setIsPaused(true);
                      }}
                      className="fr-button-secondary"
                    >
                      <p className="text-muted-foreground text-sm">Do later</p>
                    </Frigade.Button.Link>
                  </div>
                </div>
              )}
            </div>
            <style>
              {`
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
