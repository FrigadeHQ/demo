'use client';

import * as Frigade from '@frigade/react';
import { useFlow, useUser } from '@frigade/react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/spinner';

export default function Forms() {
  const ONBOARDING_FORM_FLOW_ID = 'flow_kTB2fci9';
  const { flow } = useFlow(ONBOARDING_FORM_FLOW_ID);
  const { addProperties } = useUser();
  const progress =
    ((flow?.getNumberOfCompletedSteps() || 0) /
      (flow?.getNumberOfAvailableSteps() || 1)) *
    100;
  return (
    <>
      <div
        className="container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-4 lg:px-0 overflow-y-scroll"
        style={{
          height: 'calc(100vh - 70px)',
          paddingBottom: '70px',
        }}
      >
        <div className="col-span-4">
          <Card className="md:w-[500px] w-full flex flex-col justify-center mx-auto shadow-sm pb-5 overflow-hidden">
            <Progress value={progress} className="rounded-none" />
            <div className="flex flex-col justify-center space-y-6 w-full min-h-[300px] px-5">
              {/*<Text.Body2 fontWeight="demibold">Step 1 of 3</Text.Body2>*/}
              {flow?.isCompleted || !flow ? (
                <div className="flex items-center justify-center w-full h-full">
                  <Spinner />
                </div>
              ) : (
                <Frigade.Form
                  flowId={ONBOARDING_FORM_FLOW_ID}
                  dismissible={false}
                  className="onboarding-form"
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
