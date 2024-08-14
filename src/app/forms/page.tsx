'use client';

import * as Frigade from '@frigade/react';
import {
  BaseField,
  Box,
  FormFieldProps,
  Image,
  Text,
  useFlow,
} from '@frigade/react';
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
    (Math.max(flow?.getCurrentStepOrder() || 0, 0.3) /
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
        <div className="w-[200px] text-sm flex flex-col gap-4 border rounded-md overflow-hidden p-4">
          <div className="text-xs">
            <strong>{flow?.getCurrentStepOrder()}</strong> of{' '}
            <strong>{flow?.getNumberOfAvailableSteps()}</strong> steps completed
          </div>

          <Progress value={progress} />

          <Button onClick={() => setIsPaused(false)} size="sm">
            Resume form
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-4 lg:px-0 overflow-y-scroll">
        <div className="col-span-4">
          <Card className="md:w-[500px] bg-card w-full flex flex-col justify-center mx-auto shadow-sm pb-5 overflow-hidden">
            <Progress value={progress} className="rounded-none" />
            <div className="flex flex-col justify-center space-y-6 w-full px-5">
              {flow?.isCompleted || !flow ? (
                <div className="flex items-center justify-center w-full h-full">
                  <Spinner />
                </div>
              ) : (
                <div className="flex-col justify-center w-full relative">
                  <Frigade.Form
                    flowId={ONBOARDING_FORM_FLOW_ID}
                    className="onboarding-form pt-12"
                    fieldTypes={{
                      'icon-field': IconField,
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

function IconField(props: FormFieldProps) {
  return (
    <BaseField {...props}>
      {(fieldProps) => (
        <Box position="relative">
          <Image
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWRvbGxhci1zaWduIj48bGluZSB4MT0iMTIiIHgyPSIxMiIgeTE9IjIiIHkyPSIyMiIvPjxwYXRoIGQ9Ik0xNyA1SDkuNWEzLjUgMy41IDAgMCAwIDAgN2g1YTMuNSAzLjUgMCAwIDEgMCA3SDYiLz48L3N2Zz4="
            alt="icon"
            width="16"
            height="16"
            position="absolute"
            top="calc(50% - 8px)"
            left="8px"
          />
          <Text.Body2
            as="input"
            part="field-text"
            type="text"
            pl="24px"
            {...fieldProps}
          />
        </Box>
      )}
    </BaseField>
  );
}
