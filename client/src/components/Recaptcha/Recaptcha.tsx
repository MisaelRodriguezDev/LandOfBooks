import ReCAPTCHA from 'react-google-recaptcha';
import { forwardRef, useImperativeHandle, useRef, type ReactElement } from 'react';
import type { FieldError, FieldValues, UseFormSetValue, UseFormTrigger } from 'react-hook-form';
import ErrorMessage from '../ui/Messages/Error/Error';
import type { ModuleCss } from '../../types/component';

export type ReCaptchaFieldHandle = {
  reset: () => void;
  execute: () => Promise<string | null | undefined>;
};

interface ReCaptchaFieldProps<T extends FieldValues> extends ModuleCss{
  name?: string;
  setValue: UseFormSetValue<T>;
  trigger: UseFormTrigger<T>;
  errors: FieldError | undefined;
  siteKey?: string;
}

const ReCaptchaField = forwardRef<ReCaptchaFieldHandle, ReCaptchaFieldProps<FieldValues>>(
  ({ 
    name = 'recaptcha', 
    className, 
    setValue, 
    trigger, 
    errors,
    siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY 
  }, ref) => {
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        recaptchaRef.current?.reset();
        setValue(name, '');
      },
      execute: async () => {
        const token = await recaptchaRef.current?.executeAsync();
        handleRecaptchaChange(token ?? null);
        return token;
      }
    }));

    const handleRecaptchaChange = (token: string | null) => {
      setValue(name, token ?? '', { shouldValidate: true });
      trigger(name);
    };


    return (
      <div className={className ?? ''}>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={siteKey}
          onChange={handleRecaptchaChange}
          size="normal"
          theme="light"
        />
        {errors && (
          <ErrorMessage message={errors.message} />
        )}
      </div>
    );
  }
) as <T extends FieldValues>(
  props: ReCaptchaFieldProps<T> & { ref?: React.Ref<ReCaptchaFieldHandle> }
) => ReactElement;


export default ReCaptchaField;