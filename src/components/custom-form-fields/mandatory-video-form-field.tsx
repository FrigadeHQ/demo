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

const VideoField = React.forwardRef<HTMLVideoElement, VideoFieldProps>(
  (props, forwardedRef) => {
    const [isVideoWatched, setIsVideoWatched] = useState<null | boolean>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const field = props.field;

    useEffect(() => {
      const videoElement = videoRef.current;

      if (videoElement) {
        const handleTimeUpdate = () => {
          if (
            Math.floor(videoElement.currentTime) ===
              Math.floor(videoElement.duration) &&
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
    }, [field, isVideoWatched, props.formContext]);

    useEffect(() => {
      props.formContext?.setError(field.id, {
        type: 'manual',
        message: 'You must watch the entire video to proceed.',
      });
    }, []);

    return (
      <div>
        <video ref={videoRef} width="600" controls className="mb-4">
          <source
            src="https://cdn.frigade.com/59e1ae3b-54f6-430f-9dec-7ab0d308924b.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  },
);

VideoField.displayName = 'VideoField';
