'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BaseField, FormFieldProps } from '@frigade/react';

export function MandatoryVideoFormField(props: FormFieldProps) {
  return (
    <BaseField {...props}>
      {(fieldProps) => <VideoField {...props} {...fieldProps} />}
    </BaseField>
  );
}

interface VideoFieldProps extends FormFieldProps {
  //allow any
  [key: string]: any;
}

function VideoField(props: VideoFieldProps) {
  const [isVideoWatched, setIsVideoWatched] = useState<null | boolean>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const field = props.field;

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const handleTimeUpdate = () => {
        if (
          videoElement.currentTime === videoElement.duration &&
          !isVideoWatched
        ) {
          setIsVideoWatched(true);
          field.onChange({ videoWatched: true });
          props.formContext?.clearErrors();
        }
      };

      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, []);

  useEffect(() => {
    if (isVideoWatched) {
      props.formContext.clearErrors();
    }
  }, [isVideoWatched, props.formContext, field.id]);

  useEffect(() => {
    if (isVideoWatched === null) {
      props.formContext?.setError(field.id, {
        type: 'manual',
        message: 'You must watch the entire video to proceed.',
      });
    } else {
      props.formContext?.clearErrors();
    }
  }, [props.formContext, isVideoWatched, field.id]);

  return (
    <div>
      <video ref={videoRef} width="600" controls className="mb-4">
        <source
          src="https://cdn.frigade.com/59e1ae3b-54f6-430f-9dec-7ab0d308924b.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      {/*{isVideoWatched === false && (*/}
      {/*  <p className="text-red-500 text-xs">*/}
      {/*    Please watch the video to proceed.*/}
      {/*  </p>*/}
      {/*)}*/}
    </div>
  );
}
